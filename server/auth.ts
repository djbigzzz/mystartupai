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

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Dynamic callback URL based on environment
  const getCallbackURL = () => {
    // Use the current Replit domain or custom domain
    if (process.env.REPLIT_DOMAINS) {
      const domain = process.env.REPLIT_DOMAINS.split(',')[0];
      const callbackUrl = `https://${domain}/api/auth/google/callback`;
      console.log('🔍 Google OAuth Callback URL:', callbackUrl);
      return callbackUrl;
    }
    // Fallback for local development
    return "http://localhost:5000/api/auth/google/callback";
  };

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallbackURL()
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