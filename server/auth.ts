import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy (Email/Password)
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password || '');
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth Strategy with explicit configuration
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('🔍 Configuring Google OAuth Strategy...');
  console.log('🔍 Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('🔍 Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  
  // Use production domain for OAuth callback - detect based on host
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isReplitDev = process.env.REPL_ID || process.env.REPLIT_DOMAINS;
  
  const callbackURL = (!isDevelopment && !isReplitDev)
    ? "https://mystartup.ai/api/auth/google/callback"
    : "https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback";
  console.log('🔍 Using callback URL:', callbackURL);

  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with Google ID
      const existingUser = await storage.getUserByGoogleId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const userByEmail = await storage.getUserByEmail(email);
        if (userByEmail) {
          // Link Google account to existing user
          const updatedUser = await storage.updateUser(userByEmail.id, {
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value
          });
          return done(null, updatedUser);
        }
      }

      // Create new user
      const newUser = await storage.createUser({
        email: email || '',
        name: profile.displayName || '',
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value,
        emailVerified: true // Google emails are pre-verified
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));
}

export default passport;