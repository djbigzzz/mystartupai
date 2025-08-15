import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";

// Separate Google OAuth Strategy for waitlist signup
const waitlistStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/auth/google/waitlist/callback"
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

    // Create new user for waitlist
    const newUser = await storage.createUser({
      email: email || '',
      name: profile.displayName || '',
      googleId: profile.id,
      avatar: profile.photos?.[0]?.value,
      emailVerified: true
    });

    return done(null, newUser);
  } catch (error) {
    console.error('Google OAuth waitlist error:', error);
    return done(error, false);
  }
});

passport.use('google-waitlist', waitlistStrategy);

export { waitlistStrategy };