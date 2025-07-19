import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await storage.getUserByGoogleId(profile.id);
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await storage.getUserByEmail(email);
      if (user) {
        // Link Google account to existing user
        await storage.linkGoogleAccount(user.id, profile.id);
        return done(null, user);
      }
    }
    
    // Create new user
    user = await storage.createUser({
      email: email || "",
      name: profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),
      googleId: profile.id,
      profilePicture: profile.photos?.[0]?.value,
      emailVerified: true // Google accounts are pre-verified
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;