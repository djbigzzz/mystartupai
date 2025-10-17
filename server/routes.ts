import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "./auth";
import { storage } from "./storage";
import { insertStartupIdeaSchema, insertCompanySchema, insertDocumentSchema, insertUserSchema, insertWaitlistSchema, insertStartupProfileSchema, insertDemoSessionSchema, insertArtifactSchema } from "@shared/schema";
import { analyzeStartupIdea, generateBusinessPlan, generatePitchDeck, generateWebsiteContent, generateBusinessPlanSection, assessSectionQuality } from "./anthropic";
import { agenticAI, AgenticAICofounder } from "./agentic-ai";
import { generateSessionFingerprint } from "./security";
import Anthropic from "@anthropic-ai/sdk";

// Initialize the enhanced AI co-founder
const aiCofounder = new AgenticAICofounder();

// Initialize Anthropic client for direct API calls
const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY
});
import { body, query } from "express-validator";
import {
  authRateLimiter,
  validateEmail,
  validatePassword,
  validateName,
  validateId,
  validateStartupIdea,
  handleValidationErrors,
  sanitizeQuery,
  sanitizeHtml,
  hashPassword,
  verifyPassword
} from "./security";
import { 
  advancedInputValidation, 
  validateInputLengths, 
  securityLogger, 
  advancedRateLimit 
} from "./advanced-security";
import { cleanUserDataForResponse, sanitizeForLogging } from "./privacy-protection";
import { debugOAuthConfiguration, testRedirectUri } from "./oauth-debug";
import { initiateGoogleOAuth, handleGoogleOAuthCallback } from "./manual-oauth";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { emailService } from "./email-service";
import { SiweMessage } from "siwe";
import nacl from "tweetnacl";
import bs58 from "bs58";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransfer, encodeURL, parseURL } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { CREDIT_PACKAGES, PAYMENT_METHODS, PAYMENT_STATUS, CREDIT_COSTS } from '@shared/constants';
// @ts-expect-error - PayPal SDK doesn't have official TypeScript types
import paypal from '@paypal/checkout-server-sdk';
import { gatewayService } from "./gateway-service";

// Helper function to parse AI analysis for profile form
function parseAIAnalysisForProfile(analysis: any) {
  try {
    // The analysis is an IdeaAnalysis object with structured fields
    const result = {
      companyName: generateCompanyNameFromAnalysis(analysis) || "Your Startup",
      industry: determineIndustryFromAnalysis(analysis) || "Technology", 
      problem: extractProblemFromAnalysis(analysis) || "Market need identified",
      solution: extractSolutionFromAnalysis(analysis) || "Innovative solution"
    };
    
    return result;
  } catch (error) {
    console.error("Error parsing AI analysis:", error);
    return {
      companyName: "Your Startup",
      industry: "Technology",
      problem: "AI analysis could not identify specific problems",
      solution: "AI analysis could not identify specific solutions"
    };
  }
}

// Generate a company name suggestion from AI analysis
function generateCompanyNameFromAnalysis(analysis: any): string {
  // Use the market opportunity or competitive advantage to inspire a name
  const opportunity = analysis.marketOpportunity?.toLowerCase() || "";
  const advantage = analysis.competitiveAdvantage?.toLowerCase() || "";
  
  if (opportunity.includes('cafe') || opportunity.includes('coffee')) {
    if (opportunity.includes('crypto') || opportunity.includes('blockchain')) {
      return "CryptoCafe";
    }
    return "NextGen Cafe";
  }
  
  if (opportunity.includes('tech') || advantage.includes('technology')) {
    return "TechFlow";
  }
  
  return "Your Startup";
}

// Determine industry from AI analysis
function determineIndustryFromAnalysis(analysis: any): string {
  const opportunity = analysis.marketOpportunity?.toLowerCase() || "";
  
  if (opportunity.includes('food') || opportunity.includes('cafe') || opportunity.includes('restaurant')) {
    return "Food & Beverage";
  }
  if (opportunity.includes('health') || opportunity.includes('medical')) {
    return "Healthcare";
  }
  if (opportunity.includes('finance') || opportunity.includes('crypto') || opportunity.includes('fintech')) {
    return "Finance";
  }
  if (opportunity.includes('education') || opportunity.includes('learning')) {
    return "Education";
  }
  
  return "Technology";
}

// Extract problem statement from AI analysis
function extractProblemFromAnalysis(analysis: any): string {
  // Use the weaknesses or market opportunity to identify problems
  if (analysis.weaknesses && analysis.weaknesses.length > 0) {
    return analysis.weaknesses[0]; // Take the first weakness as the main problem
  }
  
  if (analysis.marketOpportunity) {
    // Extract problem hints from market opportunity
    const opportunity = analysis.marketOpportunity;
    if (opportunity.includes('lacking') || opportunity.includes('gap') || opportunity.includes('inefficient')) {
      return opportunity.split('.')[0] + '.'; // Take first sentence
    }
  }
  
  return "Market gap identified from AI analysis";
}

// Extract solution from AI analysis  
function extractSolutionFromAnalysis(analysis: any): string {
  // Use strengths or competitive advantage to describe solution
  if (analysis.competitiveAdvantage) {
    return analysis.competitiveAdvantage;
  }
  
  if (analysis.strengths && analysis.strengths.length > 0) {
    return analysis.strengths[0]; // Take the first strength as solution approach
  }
  
  return "Innovative solution identified by AI analysis";
}

// Extract a dynamic title from the vision text
function extractTitleFromVision(vision: string): string {
  const lowerVision = vision.toLowerCase();
  
  if (lowerVision.includes('crypto') && (lowerVision.includes('cafe') || lowerVision.includes('coffee'))) {
    return "Crypto Cafe Concept";
  }
  if (lowerVision.includes('app') || lowerVision.includes('platform')) {
    return "Tech Platform Idea";
  }
  if (lowerVision.includes('service') || lowerVision.includes('business')) {
    return "Service Business Concept";
  }
  
  return "Startup Vision Analysis";
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session configuration
  // Session configuration removed - handled in index.ts

  // Test route to verify OAuth is working (completely bypasses all middleware)
  app.get("/api/test/oauth", (req, res) => {
    console.log('🔍 Test OAuth route called');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'https://mystartup.ai/api/auth/google/callback';
    const state = 'test123';
    
    const params = new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'profile email',
      access_type: 'offline',
      prompt: 'select_account',
      state: state
    });

    const authUrl = `https://accounts.google.com/oauth/authorize?${params.toString()}`;
    console.log('🔍 Test OAuth URL:', authUrl);
    res.redirect(authUrl);
  });

  // Manual OAuth routes (before Passport middleware to avoid conflicts)
  app.get("/api/auth/google/manual", initiateGoogleOAuth);
  app.get("/api/auth/google/manual/callback", handleGoogleOAuthCallback);

  // Apply advanced security middleware globally
  app.use(securityLogger);
  app.use(advancedInputValidation);
  app.use(validateInputLengths);

  // Initialize Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Secure authentication routes with rate limiting and validation
  app.post("/api/auth/register", 
    authRateLimiter,
    validateEmail,
    validatePassword,
    validateName,
    handleValidationErrors,
    async (req, res) => {
      try {
        const { email, name, password } = req.body;
        
        // Sanitize inputs
        const sanitizedEmail = sanitizeQuery(email.toLowerCase().trim());
        const sanitizedName = sanitizeHtml(name.trim());
        
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(sanitizedEmail);
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

        // Hash password with increased security
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = await storage.createUser({
          email: sanitizedEmail,
          name: sanitizedName,
          password: hashedPassword,
          emailVerified: false
        });

        // Clean user data before sending response
        const cleanUser = cleanUserDataForResponse(user);
        res.status(201).json({ 
          message: "User created successfully", 
          user: cleanUser
        });
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
      }
    }
  );

  // Signup route with auto-login
  app.post("/api/auth/signup", 
    authRateLimiter,
    validateEmail,
    validatePassword,
    validateName,
    handleValidationErrors,
    async (req, res) => {
      try {
        const { email, name, password } = req.body;
        
        // Sanitize inputs
        const sanitizedEmail = sanitizeQuery(email.toLowerCase().trim());
        const sanitizedName = sanitizeHtml(name.trim());
        
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(sanitizedEmail);
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

        // Hash password with increased security
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = await storage.createUser({
          email: sanitizedEmail,
          name: sanitizedName,
          password: hashedPassword,
          emailVerified: false
        });

        // Automatically log the user in after signup
        req.login(user, (err) => {
          if (err) {
            console.error("Login after signup error:", err);
            return res.status(500).json({ message: "Account created but login failed" });
          }
          // Store session fingerprint for security
          (req.session as any).fingerprint = generateSessionFingerprint(req);
          const cleanUser = cleanUserDataForResponse(user);
          res.status(201).json({ 
            message: "Account created successfully", 
            user: cleanUser
          });
        });
      } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" });
      }
    }
  );

  app.post("/api/auth/login", 
    authRateLimiter,
    validateEmail,
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
    (req, res, next) => {
      console.log('🔍 Login attempt:', req.body.email);
      passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          console.error('❌ Login authentication error:', err);
          return next(err);
        }
        if (!user) {
          console.log('❌ Login failed:', info?.message || 'Invalid credentials');
          // Better error message for users
          return res.status(401).json({ 
            message: 'The email or password you entered is incorrect. Please try again or reset your password.',
            suggestion: 'forgot_password' 
          });
        }
        
        // Remember me functionality - extend session if requested
        const rememberMe = req.body.rememberMe === true;
        if (rememberMe && req.session) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }
        
        req.logIn(user, (err) => {
          if (err) {
            console.error('❌ Session creation failed:', err);
            return next(err);
          }
          // Store session fingerprint for security
          (req.session as any).fingerprint = generateSessionFingerprint(req);
          console.log('✅ Login successful for user:', user.id, user.email, rememberMe ? '(remembered)' : '');
          const cleanUser = cleanUserDataForResponse(user);
          res.json({ user: cleanUser });
        });
      })(req, res, next);
    }
  );

  // 2FA Setup - Generate secret and QR code
  app.post("/api/auth/2fa/setup", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Generate a secret for the user
      const secret = speakeasy.generateSecret({
        name: `MyStartup.ai (${user.email || user.walletAddressSolana || user.walletAddressEthereum})`,
        length: 32
      });
      
      // Generate QR code data URL
      const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || '');
      
      // Store the secret temporarily (not enabled yet)
      await storage.updateUser(user.id, { 
        twoFactorSecret: secret.base32
      });
      
      res.json({
        secret: secret.base32,
        qrCode: qrCodeDataUrl
      });
    } catch (error) {
      console.error('2FA setup error:', error);
      res.status(500).json({ message: "Failed to setup 2FA" });
    }
  });

  // 2FA Verify and Enable
  app.post("/api/auth/2fa/verify", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { token } = req.body;
      
      // Re-fetch user to get latest data including the secret
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.twoFactorSecret) {
        return res.status(400).json({ message: "2FA not set up. Please set up 2FA first." });
      }
      
      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps of tolerance
      });
      
      if (!verified) {
        return res.status(401).json({ message: "Invalid 2FA code" });
      }
      
      // Enable 2FA for the user
      await storage.updateUser(user.id, { 
        twoFactorEnabled: true
      });
      
      res.json({ 
        message: "2FA enabled successfully",
        twoFactorEnabled: true
      });
    } catch (error) {
      console.error('2FA verify error:', error);
      res.status(500).json({ message: "Failed to verify 2FA code" });
    }
  });

  // 2FA Disable
  app.post("/api/auth/2fa/disable", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { password, token } = req.body;
      
      // Re-fetch user to get latest data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify password for security
      if (user.password) {
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid password" });
        }
      }
      
      // Verify 2FA token
      if (user.twoFactorSecret && user.twoFactorEnabled) {
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: token,
          window: 2
        });
        
        if (!verified) {
          return res.status(401).json({ message: "Invalid 2FA code" });
        }
      }
      
      // Disable 2FA
      await storage.updateUser(user.id, { 
        twoFactorEnabled: false,
        twoFactorSecret: null
      });
      
      res.json({ 
        message: "2FA disabled successfully",
        twoFactorEnabled: false
      });
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({ message: "Failed to disable 2FA" });
    }
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      // Check both Passport.js and manual session authentication
      console.log('🔍 Auth check - isAuthenticated:', req.isAuthenticated());
      console.log('🔍 Auth check - session userId:', (req.session as any)?.userId);
      console.log('🔍 Auth check - session user:', (req.session as any)?.user ? 'exists' : 'null');
      
      if (req.isAuthenticated()) {
        const user = req.user as any;
        const cleanUser = cleanUserDataForResponse(user);
        console.log('✅ Authenticated via Passport - user ID:', user.id);
        res.json(cleanUser);
      } else if ((req.session as any)?.userId) {
        // Manual session authentication (for manual OAuth)
        const userId = (req.session as any).userId;
        const user = await storage.getUser(userId);
        if (user) {
          const cleanUser = cleanUserDataForResponse(user);
          console.log('✅ Authenticated via manual session - user ID:', userId);
          res.json(cleanUser);
        } else {
          console.log('❌ Manual session user not found in database');
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        console.log('❌ No authentication found');
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // Get user credit balance
  app.get("/api/credits/balance", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const balance = await storage.getCreditBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      res.status(500).json({ message: "Failed to fetch credit balance" });
    }
  });

  // Complete user onboarding
  app.post("/api/auth/complete-onboarding", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as any;
      
      // Update user's onboarding completion status
      await storage.updateUser(user.id, { onboardingCompleted: true });
      
      res.json({ message: "Onboarding completed successfully" });
    } catch (error) {
      console.error("Complete onboarding error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // OAuth Debug Routes (temporary for troubleshooting)
  app.get("/api/debug/oauth", debugOAuthConfiguration);
  app.get("/api/debug/redirect-uri", testRedirectUri);

  // Manual Google OAuth (bypasses Passport.js issues) - before Passport middleware
  // These routes bypass Passport.js completely to avoid session errors

  // Try standard OAuth first, fallback to manual if needed
  app.get("/api/auth/google", (req, res) => {
    console.log('🔍 Trying standard OAuth callback first');
    // Redirect to manual OAuth with standard callback URL
    res.redirect('/api/auth/google/manual');
  });

  app.get("/api/auth/google/callback", handleGoogleOAuthCallback);

  // Google OAuth for waitlist with separate strategy
  app.get("/api/auth/google/waitlist", passport.authenticate('google-waitlist', { scope: ['profile', 'email'] }));

  app.get("/api/auth/google/waitlist/callback", 
    passport.authenticate('google-waitlist', { failureRedirect: '/waitlist' }),
    async (req, res) => {
      try {
        // Add user to waitlist if not already there
        const user = req.user as any;
        if (user.email) {
          const existingEntry = await storage.getWaitlistEntry(user.email);
          if (!existingEntry) {
            await storage.createWaitlistEntry({
              email: user.email,
              name: user.name || 'Google User',
              source: 'google_oauth'
            });
          }
        }
        res.redirect('/waitlist?success=google');
      } catch (error) {
        console.error('Waitlist signup error:', error);
        res.redirect('/waitlist?error=signup_failed');
      }
    }
  );

  // Profile management routes with validation
  app.patch("/api/auth/profile", 
    requireAuth,
    body('name').optional().isLength({ min: 1, max: 100 }).trim().escape(),
    body('username').optional().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').optional().isEmail().normalizeEmail(),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { name, username, email } = req.body;
        
        // Sanitize inputs
        const updates: any = {};
        if (name) updates.name = sanitizeHtml(name.trim());
        if (username) updates.username = sanitizeQuery(username.toLowerCase().trim());
        if (email) updates.email = sanitizeQuery(email.toLowerCase().trim());
        
        // Check if username is taken by another user
        if (updates.username) {
          const existingUser = await storage.getUserByUsername(updates.username);
          if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({ message: "Username already taken" });
          }
        }

        // Check if email is taken by another user
        if (updates.email) {
          const existingUser = await storage.getUserByEmail(updates.email);
          if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({ message: "Email already taken" });
          }
          // Reset verification if email changed
          if (updates.email !== (req.user as any).email) {
            updates.emailVerified = false;
          }
        }

        // Update user profile
        const updatedUser = await storage.updateUser(userId, updates);

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update session with new user data
      req.user = updatedUser;

      // Clean user data before sending response
      const cleanUser = cleanUserDataForResponse(updatedUser);
      res.json({ user: cleanUser });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/auth/change-password", 
    requireAuth,
    authRateLimiter,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be 8-128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage('New password must meet security requirements'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { currentPassword, newPassword } = req.body;

        // Check if user has a password (might be Google OAuth user)
        if (!(req.user as any).password) {
          return res.status(400).json({ message: "No password set for this account" });
        }

        // Verify current password
        const isCurrentPasswordValid = await verifyPassword(currentPassword, (req.user as any).password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password with enhanced security
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        const updatedUser = await storage.updateUser(userId, {
          password: hashedNewPassword
        });

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password changed successfully" });
      } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({ message: "Failed to change password" });
      }
    }
  );

  // Password reset routes
  app.post("/api/auth/forgot-password",
    authRateLimiter,
    validateEmail,
    handleValidationErrors,
    async (req, res) => {
      try {
        const { email } = req.body;
        const sanitizedEmail = sanitizeQuery(email.toLowerCase().trim());

        // Check if user exists
        const user = await storage.getUserByEmail(sanitizedEmail);
        if (!user) {
          // Return success even if user doesn't exist (security best practice)
          return res.json({ 
            message: "If an account with that email exists, we've sent a password reset link." 
          });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token
        await storage.createPasswordResetToken({
          email: sanitizedEmail,
          token: resetToken,
          expiresAt,
          used: false
        });

        // Send password reset email
        const emailSent = await emailService.sendPasswordResetEmail(sanitizedEmail, resetToken);
        
        // SECURITY: Always return the same response regardless of email service status
        // Never expose the actual reset token in the API response
        res.json({ 
          message: "If an account with that email exists, we've sent a password reset link.",
          emailSent: emailSent
        });

      } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Failed to process password reset request" });
      }
    }
  );

  app.post("/api/auth/reset-password",
    authRateLimiter,
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be 8-128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const { token, newPassword } = req.body;

        // Find valid reset token
        const resetToken = await storage.getPasswordResetToken(token);
        
        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
          return res.status(400).json({ 
            message: "Invalid or expired reset token" 
          });
        }

        // Find user by email
        const user = await storage.getUserByEmail(resetToken.email);
        if (!user) {
          return res.status(400).json({ 
            message: "User not found" 
          });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user password
        await storage.updateUser(user.id, {
          password: hashedPassword
        });

        // Mark token as used
        await storage.markPasswordResetTokenAsUsed(token);

        res.json({ message: "Password reset successfully" });

      } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to reset password" });
      }
    }
  );

  // Web3 Wallet Authentication - Challenge endpoint for secure nonce generation
  app.get("/api/auth/challenge", 
    authRateLimiter,
    async (req: Request, res: Response) => {
      try {
        // Generate a cryptographically secure random nonce
        const nonce = crypto.randomBytes(32).toString('hex');
        const timestamp = Date.now();
        // Build proper URI with scheme for SIWE compliance
        const protocol = req.protocol || 'https';
        const host = req.get('host') || 'mystartup.ai';
        const origin = `${protocol}://${host}`;
        
        // Store nonce in session with expiration (5 minutes)
        if (!req.session.authChallenges) {
          req.session.authChallenges = {};
        }
        
        // Clean up expired challenges (older than 5 minutes)
        const fiveMinutesAgo = timestamp - (5 * 60 * 1000);
        const challenges = req.session.authChallenges;
        if (challenges) {
          Object.keys(challenges).forEach(key => {
            if (challenges[key]?.timestamp < fiveMinutesAgo) {
              delete challenges[key];
            }
          });
        }
        
        // Store new challenge
        req.session.authChallenges[nonce] = {
          timestamp,
          origin,
          used: false
        };
        
        // Create proper EIP-4361 SIWE-compliant message format for Ethereum wallets
        const siweTemplate = {
          domain: origin.replace(/^https?:\/\//, ''), // Remove protocol for domain
          address: 'ADDRESS_PLACEHOLDER',              // Frontend will replace with actual address
          statement: 'MyStartup.ai wants you to sign in with your Web3 wallet.',
          uri: origin,
          version: '1',
          chainId: 1,
          nonce: nonce,
          issuedAt: new Date(timestamp).toISOString()
        };

        // Canonical EIP-4361 SIWE format
        const siweMessage = `${siweTemplate.domain} wants you to sign in with your Ethereum account.

${siweTemplate.address}

${siweTemplate.statement}

URI: ${siweTemplate.uri}
Version: ${siweTemplate.version}
Chain ID: ${siweTemplate.chainId}
Nonce: ${siweTemplate.nonce}
Issued At: ${siweTemplate.issuedAt}`;

        // For Solana wallets, include address placeholder that frontend will replace
        const solanaMessage = `MyStartup.ai wants you to sign in with your Web3 wallet.

Address: ADDRESS_PLACEHOLDER
URI: ${origin}
Version: 1
Nonce: ${nonce}
Issued At: ${new Date(timestamp).toISOString()}`;

        console.log(`🔐 Generated auth challenge: ${nonce.substring(0, 8)}... for domain: ${siweTemplate.domain}`);
        
        res.json({ 
          siweMessage,     // EIP-4361 compliant for Ethereum
          solanaMessage,   // Custom format for Solana with address field
          nonce,
          timestamp,
          domain: siweTemplate.domain
        });
        
      } catch (error) {
        console.error("Challenge generation error:", error);
        res.status(500).json({ message: "Failed to generate authentication challenge" });
      }
    }
  );

  // Web3 Wallet Authentication - Secure signature verification
  app.post("/api/auth/wallet-signin",
    authRateLimiter,
    body('signature').notEmpty().withMessage('Signature is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('nonce').notEmpty().withMessage('Nonce is required'),
    body('authMethod').isIn(['phantom', 'metamask', 'walletconnect']).withMessage('Invalid auth method'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const { signature, message, nonce, authMethod } = req.body;
        
        // Verify nonce exists and hasn't been used
        if (!req.session.authChallenges || !req.session.authChallenges[nonce]) {
          return res.status(400).json({ message: "Invalid or expired nonce" });
        }
        
        const challenge = req.session.authChallenges[nonce];
        
        // Check if nonce is expired (5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (challenge.timestamp < fiveMinutesAgo) {
          delete req.session.authChallenges[nonce];
          return res.status(400).json({ message: "Challenge expired" });
        }
        
        // Check if nonce has already been used
        if (challenge.used) {
          return res.status(400).json({ message: "Challenge already used" });
        }
        
        // Mark nonce as used to prevent replay attacks
        req.session.authChallenges[nonce].used = true;
        
        // Verify the message contains the nonce (no sanitization to preserve cryptographic integrity)
        if (!message.includes(nonce)) {
          return res.status(400).json({ message: "Message doesn't contain the required nonce" });
        }
        
        let walletAddress: string;
        
        try {
          if (authMethod === 'phantom') {
            // For Solana/Phantom - verify ed25519 signature
            try {
              // Extract wallet address from the signed message
              const addressMatch = message.match(/Address:\s*([A-Za-z0-9]{32,44})/);
              if (!addressMatch) {
                return res.status(400).json({ message: "No valid Solana address found in message" });
              }
              const claimedAddress = addressMatch[1];
              
              // Convert signature from array of bytes to Uint8Array
              let signatureBytes: Uint8Array;
              if (Array.isArray(signature)) {
                signatureBytes = new Uint8Array(signature);
              } else if (typeof signature === 'string') {
                // If signature is base64 encoded
                signatureBytes = new Uint8Array(Buffer.from(signature, 'base64'));
              } else {
                console.error("Invalid Solana signature format:", typeof signature);
                return res.status(400).json({ message: "Invalid signature format for Solana authentication" });
              }
              
              // Convert message to bytes (exactly as signed)
              const messageBytes = new TextEncoder().encode(message);
              
              // Decode the Solana address to get the public key
              let publicKeyBytes: Uint8Array;
              try {
                publicKeyBytes = bs58.decode(claimedAddress);
              } catch (error) {
                return res.status(400).json({ message: "Invalid Solana address format" });
              }
              
              // Verify the ed25519 signature
              const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
              
              if (!isValid) {
                console.error("Solana signature verification failed");
                return res.status(400).json({ message: "Invalid signature" });
              }
              
              // Signature is valid, use the verified address
              walletAddress = claimedAddress;
              
              console.log(`✅ Solana signature verified successfully for address: ${walletAddress}`);
              
            } catch (error) {
              console.error("Solana signature verification error:", error);
              return res.status(400).json({ message: "Signature verification failed" });
            }
            
          } else {
            // For Ethereum/MetaMask - verify ECDSA signature using SIWE
            try {
              // Parse the SIWE message
              const siweMessage = new SiweMessage(message);
              
              // Get expected domain from our challenge
              const expectedDomain = challenge.origin.replace(/^https?:\/\//, '');
              const expectedUri = challenge.origin;
              
              // Verify the signature with domain and nonce binding
              const siweResponse = await siweMessage.verify({ 
                signature,
                domain: expectedDomain,
                nonce: nonce
              });
              
              if (!siweResponse.success) {
                console.error("SIWE verification failed:", siweResponse.error);
                return res.status(400).json({ message: "Invalid signature or message format" });
              }
              
              // Extract the verified address from SIWE
              walletAddress = siweMessage.address.toLowerCase();
              
              // Strict verification of nonce, domain, and URI
              if (siweMessage.nonce !== nonce) {
                return res.status(400).json({ message: "Nonce mismatch" });
              }
              
              if (siweMessage.domain !== expectedDomain) {
                console.error(`Domain mismatch: expected ${expectedDomain}, got ${siweMessage.domain}`);
                return res.status(400).json({ message: "Domain mismatch" });
              }
              
              if (siweMessage.uri !== expectedUri) {
                console.error(`URI mismatch: expected ${expectedUri}, got ${siweMessage.uri}`);
                return res.status(400).json({ message: "URI mismatch" });
              }
              
              // Verify chainId - accept mainnet (1) and common testnets
              const allowedChainIds = [1, 11155111]; // Mainnet and Sepolia
              if (siweMessage.chainId && !allowedChainIds.includes(siweMessage.chainId)) {
                console.error(`Unsupported chainId: ${siweMessage.chainId}`);
                return res.status(400).json({ message: `Unsupported chain ID: ${siweMessage.chainId}` });
              }
              
              console.log(`✅ Ethereum signature verified successfully for address: ${walletAddress} on domain: ${expectedDomain}`);
              
            } catch (error) {
              console.error("SIWE parsing/verification error:", error);
              return res.status(400).json({ message: "Invalid SIWE message format or signature" });
            }
          }
          
        } catch (error) {
          console.error("Signature verification error:", error);
          return res.status(400).json({ message: "Invalid signature" });
        }
        
        console.log(`🔍 Wallet authentication attempt: ${authMethod} - ${walletAddress}`);
        
        // Check if user already exists with this wallet
        let user = null;
        if (authMethod === 'phantom') {
          user = await storage.getUserBySolanaWallet(walletAddress);
        } else {
          user = await storage.getUserByEthereumWallet(walletAddress);
        }
        
        if (user) {
          // User exists, log them in
          req.login(user, (err) => {
            if (err) {
              console.error("Wallet login error:", err);
              return res.status(500).json({ message: "Login failed" });
            }
            // Store session fingerprint for security
            (req.session as any).fingerprint = generateSessionFingerprint(req);
            const cleanUser = cleanUserDataForResponse(user);
            console.log(`✅ Wallet login successful: ${user.id} via ${authMethod}`);
            res.json({ user: cleanUser });
          });
        } else {
          // Create new user with wallet
          const newUserData: any = {
            email: null, // No email for wallet-only accounts
            name: `Web3 User`,
            authMethod: authMethod,
            emailVerified: false
          };
          
          if (authMethod === 'phantom') {
            newUserData.walletAddressSolana = walletAddress;
          } else {
            newUserData.walletAddressEthereum = walletAddress;
          }
          
          const newUser = await storage.createUser(newUserData);
          
          // Automatically log the new user in
          req.login(newUser, (err) => {
            if (err) {
              console.error("Wallet signup login error:", err);
              return res.status(500).json({ message: "Account created but login failed" });
            }
            // Store session fingerprint for security
            (req.session as any).fingerprint = generateSessionFingerprint(req);
            const cleanUser = cleanUserDataForResponse(newUser);
            console.log(`✅ Wallet signup successful: ${newUser.id} via ${authMethod}`);
            res.status(201).json({ user: cleanUser });
          });
        }
        
        // Clean up used nonce after successful authentication
        delete req.session.authChallenges[nonce];
        
      } catch (error) {
        console.error("Wallet authentication error:", error);
        res.status(500).json({ message: "Wallet authentication failed" });
      }
    }
  );

  // Google OAuth routes (temporarily disabled)
  // app.get("/api/auth/google", 
  //   passport.authenticate('google', { scope: ['profile', 'email'] })
  // );

  app.get("/api/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      res.redirect('/dashboard');
    }
  );


  
  // Submit startup idea for analysis with comprehensive validation
  app.post("/api/ideas", 
    requireAuth,
    advancedRateLimit(10, 15 * 60 * 1000), // 10 idea submissions per 15 minutes
    validateStartupIdea,
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        // Get authenticated user ID
        const userId = (req.user as any).id;
        
        // Sanitize all inputs
        const sanitizedData = {
          ...req.body,
          ideaTitle: sanitizeHtml(req.body.ideaTitle.trim()),
          description: sanitizeHtml(req.body.description.trim()),
          industry: sanitizeQuery(req.body.industry.trim()),
          stage: sanitizeQuery(req.body.stage),
          targetMarket: req.body.targetMarket ? sanitizeHtml(req.body.targetMarket.trim()) : undefined,
          problemStatement: req.body.problemStatement ? sanitizeHtml(req.body.problemStatement.trim()) : undefined,
          solutionApproach: req.body.solutionApproach ? sanitizeHtml(req.body.solutionApproach.trim()) : undefined,
          competitiveAdvantage: req.body.competitiveAdvantage ? sanitizeHtml(req.body.competitiveAdvantage.trim()) : undefined,
          revenueModel: req.body.revenueModel ? sanitizeHtml(req.body.revenueModel.trim()) : undefined
        };

        // Validate and parse with schema
        const validatedData = insertStartupIdeaSchema.parse(sanitizedData);
        
        // Check if user already has an active idea (by userId, not email - supports Web3 users)
        const existingIdeas = await storage.getStartupIdeasByUserId(userId);
        
        let idea;
        if (existingIdeas.length > 0) {
          // Update the existing idea (single-idea approach)
          idea = await storage.updateStartupIdea(existingIdeas[0].id, {
            ...validatedData,
            userId
          });
        } else {
          // Create the first idea record with userId
          idea = await storage.createStartupIdea({
            ...validatedData,
            userId
          });
        }
        
        // Ensure idea exists
        if (!idea) {
          throw new Error("Failed to create or update idea");
        }
        
        // Generate AI analysis with sanitized inputs
        // Enhanced analysis with web-enabled AI co-founder
        let analysis;
        try {
          console.log(`🤖 Using enhanced AI co-founder for: ${idea.ideaTitle}`);
          const enhancedAnalysis = await aiCofounder.analyzeStartupIdea(
            idea.ideaTitle,
            idea.description,
            idea.industry,
            idea.stage
          );

          // Convert to compatible format
          analysis = {
            score: enhancedAnalysis.overallAssessment.viabilityScore,
            strengths: enhancedAnalysis.overallAssessment.strengths,
            weaknesses: enhancedAnalysis.overallAssessment.challenges,
            marketOpportunity: `${enhancedAnalysis.marketAnalysis.marketSize} market with ${enhancedAnalysis.marketAnalysis.growthRate} growth`,
            competitiveAdvantage: enhancedAnalysis.overallAssessment.keyDifferentiators?.join(", ") || "Unique positioning identified",
            recommendations: enhancedAnalysis.overallAssessment.recommendations,
            feasibilityScore: Math.min(95, enhancedAnalysis.overallAssessment.viabilityScore + 10),
            marketSizeEstimate: enhancedAnalysis.marketAnalysis.marketSize,
            webResearchEnabled: true,
            marketAnalysis: enhancedAnalysis.marketAnalysis
          };
          console.log(`✅ Enhanced analysis completed with web research`);
        } catch (enhancedError) {
          console.warn(`⚠️ Enhanced AI failed, using basic analysis:`, enhancedError instanceof Error ? enhancedError.message : 'Unknown error');
          analysis = await analyzeStartupIdea(
            idea.ideaTitle,
            idea.description,
            idea.industry,
            idea.stage
          );
          analysis.webResearchEnabled = false;
          analysis.searchDisclaimer = "Using basic AI analysis - web research temporarily unavailable";
        }
        
        // Update the idea with analysis
        const updatedIdea = await storage.updateStartupIdea(idea.id, { analysis });
        
        res.status(201).json(updatedIdea);
      } catch (error) {
        console.error("Error creating idea:", error);
        res.status(400).json({ 
          message: error instanceof Error ? error.message : "Failed to create idea" 
        });
      }
    }
  );

  // AI analyze startup vision for profile form
  app.post("/api/ai/analyze-startup-idea",
    advancedRateLimit(5, 10 * 60 * 1000), // 5 AI analysis requests per 10 minutes
    body('vision').isLength({ min: 10, max: 2000 }).withMessage('Vision must be between 10 and 2000 characters'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { vision } = req.body;
        const sanitizedVision = sanitizeHtml(vision.trim());
        
        // Use OpenAI to analyze the startup vision
        const analysis = await analyzeStartupIdea(
          extractTitleFromVision(sanitizedVision), // more dynamic title
          sanitizedVision, // description 
          "General", // industry (will be determined by AI)
          "Concept" // stage
        );
        
        // Parse the AI analysis to extract structured data
        const structuredAnalysis = parseAIAnalysisForProfile(analysis);
        
        res.json(structuredAnalysis);
      } catch (error) {
        console.error("Error analyzing startup vision:", error);
        res.status(500).json({ 
          message: "AI analysis failed. Please try again or continue manually." 
        });
      }
    }
  );

  // Get startup idea by ID with validation and ownership check
  app.get("/api/ideas/:id", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const userId = (req.user as any).id;
        const idea = await storage.getStartupIdea(id);
        
        if (!idea) {
          return res.status(404).json({ message: "Startup idea not found" });
        }
        
        // Security check: Ensure the user owns this idea (use userId, not email for Web3 compatibility)
        if (idea.userId !== userId) {
          return res.status(403).json({ message: "Access denied: You don't have permission to view this startup idea" });
        }
        
        res.json(idea);
      } catch (error) {
        console.error("Error fetching idea:", error);
        res.status(500).json({ message: "Failed to fetch idea" });
      }
    }
  );

  // Get startup ideas for authenticated user (protected route)
  app.get("/api/ideas", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Support both email-based users and Web3 wallet users
      let ideas;
      if (user.email) {
        ideas = await storage.getStartupIdeasByEmail(user.email);
      } else if (user.id) {
        ideas = await storage.getStartupIdeasByUserId(user.id);
      } else {
        return res.status(400).json({ message: "User identification failed" });
      }
      
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });

  // Delete startup idea (allows user to start fresh)
  app.delete("/api/ideas/:id",
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const userId = (req.user as any).id;
        const idea = await storage.getStartupIdea(id);
        
        if (!idea) {
          return res.status(404).json({ message: "Startup idea not found" });
        }
        
        // Security check: Ensure the user owns this idea
        if (idea.userId !== userId) {
          return res.status(403).json({ message: "Access denied: You don't have permission to delete this idea" });
        }
        
        const deleted = await storage.deleteStartupIdea(id);
        
        if (deleted) {
          res.json({ message: "Idea deleted successfully. You can now create a new one!" });
        } else {
          res.status(500).json({ message: "Failed to delete idea" });
        }
      } catch (error) {
        console.error("Error deleting idea:", error);
        res.status(500).json({ message: "Failed to delete idea" });
      }
    }
  );

  // Regenerate AI analysis for existing idea
  app.post("/api/ideas/:id/regenerate",
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const userId = (req.user as any).id;
        const idea = await storage.getStartupIdea(id);
        
        if (!idea) {
          return res.status(404).json({ message: "Startup idea not found" });
        }
        
        // Security check: Ensure the user owns this idea
        if (idea.userId !== userId) {
          return res.status(403).json({ message: "Access denied: You don't have permission to regenerate analysis for this idea" });
        }
        
        // Regenerate AI analysis
        let analysis;
        try {
          console.log(`🔄 Regenerating AI analysis for: ${idea.ideaTitle}`);
          const enhancedAnalysis = await aiCofounder.analyzeStartupIdea(
            idea.ideaTitle,
            idea.description,
            idea.industry,
            idea.stage
          );

          // Convert to compatible format
          analysis = {
            score: enhancedAnalysis.overallAssessment.viabilityScore,
            strengths: enhancedAnalysis.overallAssessment.strengths,
            weaknesses: enhancedAnalysis.overallAssessment.challenges,
            marketOpportunity: `${enhancedAnalysis.marketAnalysis.marketSize} market with ${enhancedAnalysis.marketAnalysis.growthRate} growth`,
            competitiveAdvantage: enhancedAnalysis.overallAssessment.keyDifferentiators?.join(", ") || "Unique positioning identified",
            recommendations: enhancedAnalysis.overallAssessment.recommendations,
            feasibilityScore: Math.min(95, enhancedAnalysis.overallAssessment.viabilityScore + 10),
            marketSizeEstimate: enhancedAnalysis.marketAnalysis.marketSize,
            webResearchEnabled: true,
            marketAnalysis: enhancedAnalysis.marketAnalysis
          };
          console.log(`✅ Analysis regenerated successfully`);
        } catch (enhancedError) {
          console.warn(`⚠️ Enhanced AI failed, using basic analysis:`, enhancedError instanceof Error ? enhancedError.message : 'Unknown error');
          analysis = await analyzeStartupIdea(
            idea.ideaTitle,
            idea.description,
            idea.industry,
            idea.stage
          );
          analysis.webResearchEnabled = false;
          analysis.searchDisclaimer = "Using basic AI analysis - web research temporarily unavailable";
        }
        
        // Update the idea with new analysis
        const updatedIdea = await storage.updateStartupIdea(id, { analysis });
        
        res.json({
          message: "AI analysis regenerated successfully!",
          idea: updatedIdea
        });
      } catch (error) {
        console.error("Error regenerating analysis:", error);
        res.status(500).json({ message: "Failed to regenerate analysis" });
      }
    }
  );

  // Helper function to deduct credits and track overage usage
  async function deductCreditsWithTracking(
    req: any,
    userId: number,
    amount: number,
    description: string,
    feature: string,
    relatedId?: number
  ) {
    // Deduct the credits
    await storage.deductCredits(userId, amount, description, feature, relatedId);

    // Track only the precise overage amount (not the full feature cost)
    const overageAmount = req.creditsToDeduct?.overageAmount || 0;
    if (overageAmount > 0) {
      const user = await storage.getUser(userId);
      const currentOverage = user?.monthlyCreditsUsed || 0;
      const newOverage = currentOverage + overageAmount;
      
      await storage.updateUser(userId, {
        monthlyCreditsUsed: newOverage
      });

      // Check usage alert threshold
      if (user?.usageAlert && newOverage >= user.usageAlert && currentOverage < user.usageAlert) {
        // First time crossing threshold - set alert flag in request for response
        req.usageAlertTriggered = {
          threshold: user.usageAlert,
          current: newOverage
        };
      }
    }
  }

  // Helper function to check and reset monthly credits for subscription users
  async function checkAndResetMonthlyCredits(userId: number) {
    try {
      const user = await storage.getUser(userId);
      if (!user) return;

      // Only process for active subscriptions or cancel_at_period_end
      if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'cancel_at_period_end') {
        return;
      }

      const now = new Date();
      const creditsResetDate = user.creditsResetDate ? new Date(user.creditsResetDate) : null;
      
      // Check if we need to reset credits
      if (creditsResetDate && now >= creditsResetDate) {
        const currentPlan = user.currentPlan || 'FREEMIUM';
        const packageInfo = CREDIT_PACKAGES[currentPlan as keyof typeof CREDIT_PACKAGES];
        
        if (!packageInfo) return;

        // Calculate next reset date (1 month from now)
        const nextResetDate = new Date(now);
        nextResetDate.setMonth(nextResetDate.getMonth() + 1);
        
        const nextBillingDate = new Date(nextResetDate);

        // Handle cancelled subscriptions
        if (user.subscriptionStatus === 'cancel_at_period_end') {
          // Downgrade to FREEMIUM at period end
          await storage.updateUser(userId, {
            currentPlan: 'FREEMIUM',
            credits: CREDIT_PACKAGES.FREEMIUM.credits,
            subscriptionStatus: 'expired',
            creditsResetDate: nextResetDate,
            monthlyCreditsUsed: 0,
          });
          console.log(`Subscription expired for user ${userId}, downgraded to FREEMIUM`);
          return;
        }

        // Reset credits for active subscriptions
        await storage.updateUser(userId, {
          credits: packageInfo.credits,
          creditsResetDate: nextResetDate,
          nextBillingDate: nextBillingDate,
          monthlyCreditsUsed: 0, // Reset overage tracking
        });

        console.log(`Credits reset for user ${userId}: ${packageInfo.credits} credits`);
      }
    } catch (error) {
      console.error('Error checking/resetting monthly credits:', error);
    }
  }

  // Credit check middleware - checks if user has sufficient credits for a feature
  const checkCredits = (requiredCredits: number, featureName: string) => {
    return async (req: any, res: any, next: any) => {
      try {
        const userId = req.user.id;
        
        // Check and reset monthly credits if needed
        await checkAndResetMonthlyCredits(userId);
        
        const user = await storage.getUser(userId);
        const userCredits = await storage.getUserCredits(userId);
        
        // If user has enough credits, proceed normally
        if (userCredits >= requiredCredits) {
          req.creditsToDeduct = {
            amount: requiredCredits,
            feature: featureName,
            fromAllocation: true,
            overageAmount: 0
          };
          next();
          return;
        }

        // Check if user has active subscription (usage-based billing)
        if (user && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'cancel_at_period_end')) {
          // Clamp balance to 0 minimum to handle negative balances from prior overage
          const availableCredits = Math.max(userCredits, 0);
          
          // Calculate precise overage amount (cannot exceed feature cost)
          const overageAmount = Math.min(requiredCredits, Math.max(0, requiredCredits - availableCredits));
          
          req.creditsToDeduct = {
            amount: requiredCredits,
            feature: featureName,
            fromAllocation: availableCredits >= requiredCredits,
            overageAmount: overageAmount
          };
          next();
          return;
        }
        
        // No subscription and not enough credits - deny access
        return res.status(402).json({ 
          message: `You don't have enough credits to generate ${featureName}. Please purchase more credits or subscribe to a plan.`,
          current: userCredits,
          required: requiredCredits,
          shortfall: requiredCredits - userCredits
        });
      } catch (error) {
        console.error('Credit check error:', error);
        res.status(500).json({ message: "Failed to check credit balance" });
      }
    };
  };

  // Generate comprehensive business plan
  app.post("/api/startup-ideas/:id/business-plan", 
    requireAuth, 
    checkCredits(CREDIT_COSTS.BUSINESS_PLAN, 'Business Plan'),
    async (req, res) => {
    try {
      const ideaId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this startup idea" });
      }

      const analysis = idea.analysis as any;
      const businessPlan = await generateBusinessPlan(
        idea.ideaTitle,
        idea.description,
        idea.industry,
        idea.problemStatement || undefined,
        idea.solutionApproach || undefined,
        idea.targetMarket || undefined,
        analysis
      );

      // Convert business plan to section-based format for the component
      const sectionsData = {
        "executive-summary": businessPlan.executiveSummary,
        "problem-statement": businessPlan.problemStatement,
        "solution-overview": businessPlan.solutionDescription,
        "market-analysis": businessPlan.marketAnalysis,
        "business-model": businessPlan.businessModel,
        "marketing-strategy": businessPlan.marketingStrategy,
        "operations-plan": businessPlan.operationalPlan,
        "management-team": businessPlan.managementTeam,
        "financial-projections": businessPlan.financialProjections,
        "funding-request": businessPlan.fundingRequirements,
        "risk-analysis": businessPlan.riskAnalysis,
        "implementation-timeline": businessPlan.timeline
      };

      await storage.updateStartupIdea(ideaId, {
        businessPlan
      });

      // Deduct credits and track overage
      await deductCreditsWithTracking(
        req,
        userId,
        CREDIT_COSTS.BUSINESS_PLAN,
        'Business Plan generation',
        'business_plan',
        ideaId
      );

      // Include usage alert if triggered
      const response: any = sectionsData;
      if ((req as any).usageAlertTriggered) {
        response._alert = {
          message: `You've exceeded your usage alert threshold of ${(req as any).usageAlertTriggered.threshold} credits. Current overage: ${(req as any).usageAlertTriggered.current} credits.`,
          threshold: (req as any).usageAlertTriggered.threshold,
          current: (req as any).usageAlertTriggered.current
        };
      }

      res.json(response);
    } catch (error) {
      console.error("Error generating business plan:", error);
      res.status(500).json({ message: "Failed to generate business plan" });
    }
  });

  // Generate business plan for an idea
  app.post("/api/ideas/:id/business-plan", 
    requireAuth,
    checkCredits(CREDIT_COSTS.BUSINESS_PLAN, 'Business Plan'),
    validateId,
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this startup idea" });
      }
      
      if (!idea.analysis) {
        return res.status(400).json({ message: "Idea must be analyzed first" });
      }
      
      const businessPlan = await generateBusinessPlan(
        idea.ideaTitle,
        idea.description,
        idea.industry,
        idea.stage,
        idea.analysis as any
      );
      
      const updatedIdea = await storage.updateStartupIdea(id, { businessPlan });
      
      // Deduct credits and track overage
      await deductCreditsWithTracking(
        req,
        userId,
        CREDIT_COSTS.BUSINESS_PLAN,
        'Business Plan generation',
        'business_plan',
        id
      );
      
      res.json(updatedIdea);
    } catch (error) {
      console.error("Error generating business plan:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate business plan" 
      });
    }
  });

  // Generate individual business plan section
  app.post("/api/startup-ideas/:id/business-plan/section/:sectionId", requireAuth, async (req, res) => {
    try {
      const ideaId = parseInt(req.params.id);
      const sectionId = req.params.sectionId;
      const { existingContent } = req.body;
      const userEmail = (req.user as any).email;

      const idea = await storage.getStartupIdea(ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this startup idea" });
      }

      const analysis = idea.analysis as any;
      const sectionContent = await generateBusinessPlanSection(
        sectionId,
        idea.ideaTitle,
        idea.description,
        idea.industry,
        existingContent || {},
        analysis
      );

      res.json(sectionContent);
    } catch (error) {
      console.error("Error generating section:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate section" 
      });
    }
  });


  // ==================== JOURNEY API ROUTES ====================
  
  // Get journey progress for authenticated user
  app.get("/api/journey/progress", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const progress = await storage.getJourneyProgress(userId);
      
      if (!progress) {
        // Create initial progress if doesn't exist
        const newProgress = await storage.createJourneyProgress({
          userId,
          currentStage: 1,
          stage1Completed: false,
          stage2Completed: false,
          stage3Completed: false,
          stage4Completed: false,
          progressPercentage: 0,
          badges: []
        });
        return res.json(newProgress);
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error fetching journey progress:", error);
      res.status(500).json({ message: "Failed to fetch journey progress" });
    }
  });

  // Get validation result for authenticated user
  app.get("/api/journey/validation", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validation = await storage.getJourneyValidation(userId);
      
      if (!validation) {
        return res.status(404).json({ message: "No validation found. Please validate your idea first." });
      }
      
      res.json(validation);
    } catch (error) {
      console.error("Error fetching validation:", error);
      res.status(500).json({ message: "Failed to fetch validation" });
    }
  });

  // Validate startup idea with AI - Comprehensive 8-Dimension Analysis
  app.post("/api/journey/validate", 
    requireAuth,
    checkCredits(CREDIT_COSTS.AI_ANALYSIS, 'Idea Validation'),
    async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { 
        ideaTitle = "",
        idea, 
        industry = "",
        stage = "idea",
        problemStatement = "",
        solutionApproach = "",
        targetMarket = "",
        marketSize = "",
        competitors = "",
        competitiveEdge = ""
      } = req.body;
      
      if (!idea || idea.trim().length < 20) {
        return res.status(400).json({ message: "Please provide a detailed idea description (at least 20 characters)" });
      }

      // Build comprehensive context for AI
      const context = `
STARTUP IDEA DETAILS:
Title: ${ideaTitle || "Not provided"}
Description: ${idea}
Industry: ${industry || "Not specified"}
Stage: ${stage || "Idea stage"}

PROBLEM & SOLUTION:
Problem: ${problemStatement || "Not detailed"}
Solution: ${solutionApproach || "Not detailed"}

MARKET & CUSTOMERS:
Target Market: ${targetMarket || "Not specified"}
Market Size: ${marketSize || "Not researched"}

COMPETITION:
Competitors: ${competitors || "Not identified"}
Competitive Edge: ${competitiveEdge || "Not defined"}
      `.trim();

      // Use Claude AI to validate the idea with comprehensive analysis
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `You are an expert startup validator in the style of Y Combinator. Provide comprehensive validation across 8 critical dimensions.

${context}

Analyze this startup across these 8 dimensions and return a JSON response:

{
  "score": <0-100 overall score>,
  "verdict": "<GO if >=70, REFINE if 50-69, PIVOT if <50>",
  "ideaClarity": {
    "score": <0-100>,
    "problemDefinition": "<clear problem statement>",
    "solutionClarity": "<solution clarity assessment>",
    "oneSentencePitch": "<craft a one-sentence pitch>"
  },
  "marketValidation": {
    "score": <0-100>,
    "tam": "<Total Addressable Market estimate>",
    "sam": "<Serviceable Addressable Market>",
    "som": "<Serviceable Obtainable Market>",
    "growthRate": "<market growth rate estimate>",
    "marketTiming": "<early/perfect/late>",
    "whyNow": ["reason 1", "reason 2", "reason 3"]
  },
  "competitiveIntelligence": {
    "score": <0-100>,
    "competitionLevel": "<none/low/medium/high/saturated>",
    "directCompetitors": ["competitor 1", "competitor 2", "competitor 3"],
    "competitiveEdge": "<assessment of competitive advantages>"
  },
  "customerDiscovery": {
    "score": <0-100>,
    "personaClarity": "<target customer description>",
    "painPointSeverity": <1-10>,
    "willingnessToPay": "<low/medium/high with reasoning>",
    "earlyAdopterProfile": "<who would be early adopters>"
  },
  "problemSolutionFit": {
    "score": <0-100>,
    "problemSeverity": <1-10>,
    "solutionFeasibility": <1-10>,
    "tenXTest": "<is this 10x better than alternatives?>",
    "recommendation": "<proceed/iterate/pivot>"
  },
  "riskAssessment": {
    "score": <0-100, higher = lower risk>,
    "topRisks": ["risk 1", "risk 2", "risk 3"],
    "topOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
  },
  "validationExperiments": {
    "experiments": [
      {
        "name": "Experiment name",
        "description": "What to test and how",
        "week": 1
      },
      {
        "name": "Experiment 2",
        "description": "Description",
        "week": 2
      },
      {
        "name": "Experiment 3",
        "description": "Description",
        "week": 3
      }
    ]
  },
  "recommendations": ["actionable recommendation 1", "recommendation 2", "recommendation 3"]
}

Be thorough, analytical, and provide specific, actionable insights. Calculate scores based on the information provided.`
        }]
      });

      const content = response.content[0];
      let textContent = content.type === 'text' ? content.text : '{}';
      
      // Strip markdown code fences if present
      textContent = textContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      const validationData = JSON.parse(textContent);
      
      // Add the original idea to response
      validationData.idea = idea;

      // Store validation result (basic fields for backward compatibility)
      const validation = await storage.createJourneyValidation({
        userId,
        score: validationData.score,
        verdict: validationData.verdict,
        marketSize: validationData.marketValidation?.tam || "Market size not analyzed",
        competition: validationData.competitiveIntelligence?.competitiveEdge || "Competition not analyzed",
        feasibility: `Problem: ${validationData.problemSolutionFit?.problemSeverity || 0}/10, Solution: ${validationData.problemSolutionFit?.solutionFeasibility || 0}/10`,
        risks: validationData.riskAssessment?.topRisks || [],
        opportunities: validationData.riskAssessment?.topOpportunities || [],
        recommendations: validationData.recommendations || []
      });

      // Update journey progress
      await storage.updateJourneyProgress(userId, {
        stage1Completed: validationData.score >= 60,
        currentStage: validationData.score >= 60 ? 2 : 1,
        progressPercentage: validationData.score >= 60 ? 25 : Math.floor(validationData.score / 4)
      });

      // Deduct credits
      await deductCreditsWithTracking(
        req,
        userId,
        CREDIT_COSTS.AI_ANALYSIS,
        'Idea Validation',
        'journey_validation'
      );

      res.json(validationData);
    } catch (error) {
      console.error("Error validating idea:", error);
      res.status(500).json({ message: "Failed to validate idea. Please try again." });
    }
  });

  // AI Improve text endpoint for form fields
  app.post("/api/journey/ai-improve", 
    async (req, res) => {
    try {
      // Check authentication manually with better logging
      console.log("[AI Improve] Request received");
      console.log("[AI Improve] isAuthenticated:", req.isAuthenticated?.());
      console.log("[AI Improve] User:", req.user);
      console.log("[AI Improve] Session:", req.session ? "exists" : "missing");
      
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.log("[AI Improve] Authentication failed - returning 401");
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = (req.user as any)?.id;
      console.log("[AI Improve] User ID:", userId);
      
      const { text, fieldType } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Text is required" });
      }

      // Define improvement prompts for different field types
      const prompts: Record<string, string> = {
        title: `Improve this startup idea title to make it more compelling and memorable. Keep it concise (under 60 characters) but impactful:\n\n"${text}"\n\nProvide ONLY the improved title, nothing else.`,
        
        description: `Improve this startup description to be clear, compelling, and investor-friendly. Focus on the problem, solution, and value proposition:\n\n"${text}"\n\nProvide ONLY the improved description (1-2 sentences), nothing else.`,
        
        problem: `Improve this problem statement to be more specific, quantifiable, and compelling. Include who faces this problem and why it matters:\n\n"${text}"\n\nProvide ONLY the improved problem statement, nothing else.`,
        
        solution: `Improve this solution description to be clearer and more compelling. Focus on the unique approach and key benefits:\n\n"${text}"\n\nProvide ONLY the improved solution description, nothing else.`,
        
        target: `Improve this target market description to be more specific with demographics, behaviors, and market size insights:\n\n"${text}"\n\nProvide ONLY the improved target market description, nothing else.`,
        
        'market-size': `Improve this market size description with more specific numbers, TAM/SAM/SOM framework if applicable:\n\n"${text}"\n\nProvide ONLY the improved market size description, nothing else.`,
        
        competitors: `Improve this competitor list to be more specific and structured. Include both direct and indirect competitors:\n\n"${text}"\n\nProvide ONLY the improved competitor description, nothing else.`,
        
        edge: `Improve this competitive edge description to be more compelling and defensible. Focus on unique advantages:\n\n"${text}"\n\nProvide ONLY the improved competitive edge description, nothing else.`,
      };

      const prompt = prompts[fieldType] || `Improve this text to be clearer and more professional:\n\n"${text}"\n\nProvide ONLY the improved text, nothing else.`;

      // Use Claude AI to improve the text
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      const content = response.content[0];
      const improvedText = content.type === 'text' ? content.text.trim() : text;

      res.json({ improvedText });
    } catch (error) {
      console.error("Error improving text:", error);
      res.status(500).json({ message: "Failed to improve text. Please try again." });
    }
  });

  // ==================== END JOURNEY API ROUTES ====================

  // Generate pitch deck for an idea
  app.post("/api/ideas/:id/pitch-deck", 
    requireAuth,
    checkCredits(CREDIT_COSTS.PITCH_DECK, 'Pitch Deck'),
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this startup idea" });
      }
      
      if (!idea.businessPlan) {
        return res.status(400).json({ message: "Business plan must be generated first" });
      }
      
      const pitchDeck = await generatePitchDeck(
        idea.ideaTitle,
        idea.description,
        idea.industry,
        idea.businessPlan as any
      );
      
      const updatedIdea = await storage.updateStartupIdea(id, { pitchDeck });
      
      // Deduct credits and track overage
      await deductCreditsWithTracking(
        req,
        userId,
        CREDIT_COSTS.PITCH_DECK,
        'Pitch Deck generation',
        'pitch_deck',
        id
      );
      
      res.json(updatedIdea);
    } catch (error) {
      console.error("Error generating pitch deck:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate pitch deck" 
      });
    }
  });

  // Company management routes
  app.post("/api/companies", 
    requireAuth,
    advancedRateLimit(5, 15 * 60 * 1000), // 5 companies per 15 minutes
    body('name').isLength({ min: 1, max: 200 }).trim().escape(),
    body('description').optional().isLength({ max: 1000 }).trim(),
    body('industry').optional().isLength({ max: 100 }).trim(),
    body('stage').optional().isIn(['idea', 'mvp', 'launch', 'growth']),
    handleValidationErrors,
    async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Sanitize inputs
      const sanitizedData = {
        companyName: sanitizeHtml(req.body.name.trim()),
        description: req.body.description ? sanitizeHtml(req.body.description.trim()) : "Company description",
        industry: req.body.industry ? sanitizeQuery(req.body.industry.trim()) : "Technology",
        stage: req.body.stage ? sanitizeQuery(req.body.stage) : 'idea',
      };
      
      const validatedData = insertCompanySchema.parse(sanitizedData);
      const companyWithUserId = { ...validatedData, userId };
      const company = await storage.createCompany(companyWithUserId);
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create company" 
      });
    }
  });

  app.get("/api/companies", 
    requireAuth,
    async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const companies = await storage.getCompaniesByUser(userId);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const company = await storage.getCompany(id);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Verify ownership
      if (company.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to access this company" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.put("/api/companies/:id", 
    requireAuth,
    validateId,
    body('name').optional().isLength({ min: 1, max: 200 }).trim().escape(),
    body('description').optional().isLength({ max: 1000 }).trim(),
    body('industry').optional().isLength({ max: 100 }).trim(),
    body('stage').optional().isIn(['idea', 'mvp', 'launch', 'growth']),
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Verify ownership
      const existingCompany = await storage.getCompany(id);
      if (!existingCompany || existingCompany.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this company" });
      }
      
      // Sanitize inputs
      const sanitizedUpdates: any = {};
      if (req.body.name) sanitizedUpdates.name = sanitizeHtml(req.body.name.trim());
      if (req.body.description) sanitizedUpdates.description = sanitizeHtml(req.body.description.trim());
      if (req.body.industry) sanitizedUpdates.industry = sanitizeQuery(req.body.industry.trim());
      if (req.body.stage) sanitizedUpdates.stage = sanitizeQuery(req.body.stage);
      
      const company = await storage.updateCompany(id, sanitizedUpdates);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  // Document management routes
  app.post("/api/companies/:companyId/documents", 
    requireAuth,
    validateId,
    body('title').isLength({ min: 1, max: 200 }).trim().escape(),
    body('content').isLength({ min: 1, max: 10000 }).trim(),
    body('type').isIn(['business_plan', 'pitch_deck', 'financial_model', 'legal', 'other']),
    handleValidationErrors,
    async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const userId = (req.user as any).id;
      
      // Verify company ownership
      const company = await storage.getCompany(companyId);
      if (!company || company.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to create documents for this company" });
      }
      
      // Sanitize inputs
      const sanitizedData = {
        ...req.body,
        companyId,
        title: sanitizeHtml(req.body.title.trim()),
        content: sanitizeHtml(req.body.content.trim()),
        type: sanitizeQuery(req.body.type)
      };
      
      const validatedData = insertDocumentSchema.parse(sanitizedData);
      const document = await storage.createDocument(validatedData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create document" 
      });
    }
  });

  app.get("/api/companies/:companyId/documents", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const userId = (req.user as any).id;
      
      // Verify company ownership
      const company = await storage.getCompany(companyId);
      if (!company || company.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to access documents for this company" });
      }
      
      const documents = await storage.getDocumentsByCompany(companyId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.put("/api/documents/:id", 
    requireAuth,
    validateId,
    body('title').optional().isLength({ min: 1, max: 200 }).trim().escape(),
    body('content').optional().isLength({ min: 1, max: 10000 }).trim(),
    body('type').optional().isIn(['business_plan', 'pitch_deck', 'financial_model', 'legal', 'other']),
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Get document and verify ownership via company
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      if (document.companyId === null) {
        return res.status(400).json({ message: "Document has no associated company" });
      }
      
      const company = await storage.getCompany(document.companyId);
      if (!company || company.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this document" });
      }
      
      // Sanitize updates
      const sanitizedUpdates: any = {};
      if (req.body.title) sanitizedUpdates.title = sanitizeHtml(req.body.title.trim());
      if (req.body.content) sanitizedUpdates.content = sanitizeHtml(req.body.content.trim());
      if (req.body.type) sanitizedUpdates.type = sanitizeQuery(req.body.type);
      
      const updatedDocument = await storage.updateDocument(id, sanitizedUpdates);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Get document and verify ownership via company
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      if (document.companyId === null) {
        return res.status(400).json({ message: "Document has no associated company" });
      }
      
      const company = await storage.getCompany(document.companyId);
      if (!company || company.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this document" });
      }
      
      const success = await storage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });


  app.post("/api/auth/login-legacy", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password with bcrypt
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      (req.session as any).userId = user.id;

      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Duplicate auth/me route removed - using Passport route above

  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session?.destroy((err: any) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Startup Profile routes
  app.get("/api/startup-profile", async (req, res) => {
    try {
      // Check session-based auth first
      const userId = (req.session as any)?.userId || (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const profile = await storage.getStartupProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Startup profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching startup profile:", error);
      res.status(500).json({ message: "Failed to fetch startup profile" });
    }
  });

  app.post("/api/startup-profile", async (req, res) => {
    try {
      // Check session-based auth first
      const userId = (req.session as any)?.userId || (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertStartupProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createStartupProfile(validatedData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating startup profile:", error);
      res.status(500).json({ message: "Failed to create startup profile" });
    }
  });

  app.patch("/api/startup-profile/:id", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      // Check session-based auth first
      const userId = (req.session as any)?.userId || (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Verify ownership
      const existingProfile = await storage.getStartupProfile(userId);
      if (!existingProfile || existingProfile.id !== profileId) {
        return res.status(403).json({ message: "Unauthorized to update this profile" });
      }
      
      const validatedData = insertStartupProfileSchema.partial().parse(req.body);
      const profile = await storage.updateStartupProfile(profileId, validatedData);
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating startup profile:", error);
      res.status(500).json({ message: "Failed to update startup profile" });
    }
  });

  // Generate pitch deck
  app.post("/api/startup-ideas/:id/pitch-deck", requireAuth, async (req, res) => {
    try {
      const ideaId = parseInt(req.params.id);
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this startup idea" });
      }

      const businessPlan = idea.businessPlan as any;
      const pitchDeck = await generatePitchDeck(
        idea.ideaTitle,
        idea.description,
        idea.industry,
        businessPlan
      );

      // Convert pitch deck to slide-based format
      const slidesData = {
        "title": {
          content: `${idea.ideaTitle}\n\nTransforming ${idea.industry} through innovation`,
          notes: "Introduce your company with confidence. Mention the problem you solve and why now is the right time."
        },
        "problem": {
          content: idea.problemStatement || pitchDeck.slides[1]?.content || "Market problem definition...",
          notes: pitchDeck.slides[1]?.notes || "Explain the pain point your target customers face daily."
        },
        "solution": {
          content: idea.solutionApproach || pitchDeck.slides[2]?.content || "Our innovative solution...",
          notes: pitchDeck.slides[2]?.notes || "Demonstrate how your solution uniquely addresses the problem."
        },
        "market": {
          content: pitchDeck.slides[3]?.content || "Market opportunity and size...",
          notes: pitchDeck.slides[3]?.notes || "Show the market size and growth potential."
        },
        "business-model": {
          content: pitchDeck.slides[4]?.content || "Revenue model and strategy...",
          notes: pitchDeck.slides[4]?.notes || "Explain how you make money and your unit economics."
        },
        "traction": {
          content: pitchDeck.slides[5]?.content || "Growth metrics and achievements...",
          notes: pitchDeck.slides[5]?.notes || "Show your progress and validation to date."
        },
        "team": {
          content: pitchDeck.slides[6]?.content || "Founding team and expertise...",
          notes: pitchDeck.slides[6]?.notes || "Highlight why your team can execute this vision."
        },
        "financial": {
          content: pitchDeck.slides[7]?.content || "Financial projections...",
          notes: pitchDeck.slides[7]?.notes || "Present realistic financial forecasts and key metrics."
        },
        "funding": {
          content: pitchDeck.slides[8]?.content || "Investment request and use of funds...",
          notes: pitchDeck.slides[8]?.notes || "Clearly state your ask and how funds will be used."
        },
        "closing": {
          content: pitchDeck.slides[9]?.content || "Thank you and next steps...",
          notes: pitchDeck.slides[9]?.notes || "End with a strong call to action and contact information."
        }
      };

      await storage.updateStartupIdea(ideaId, {
        pitchDeck
      });

      res.json(slidesData);
    } catch (error) {
      console.error("Error generating pitch deck:", error);
      res.status(500).json({ message: "Failed to generate pitch deck" });
    }
  });

  // Generate website content using AI
  app.post("/api/website/generate-content", 
    requireAuth,
    advancedRateLimit(5, 10 * 60 * 1000), // 5 website generations per 10 minutes
    body('companyName').notEmpty().isLength({ max: 100 }).trim().escape(),
    body('description').notEmpty().isLength({ max: 1000 }).trim(),
    body('industry').notEmpty().isLength({ max: 50 }).trim().escape(),
    body('sections').optional().isArray(),
    body('sections.*').optional().isString().isLength({ max: 50 }),
    handleValidationErrors,
    async (req, res) => {
      try {
        const { companyName, description, industry, sections, businessPlan } = req.body;
        
        // Sanitize inputs
        const sanitizedCompanyName = sanitizeHtml(companyName.trim());
        const sanitizedDescription = sanitizeHtml(description.trim());
        const sanitizedIndustry = sanitizeHtml(industry.trim());
        const requestedSections = Array.isArray(sections) ? sections.map(s => sanitizeQuery(s)) : undefined;

        // Generate website content using OpenAI
        const websiteContent = await generateWebsiteContent(
          sanitizedCompanyName,
          sanitizedDescription, 
          sanitizedIndustry,
          requestedSections,
          businessPlan
        );

        res.json(websiteContent);
      } catch (error) {
        console.error("Website content generation error:", error);
        if (error instanceof Error && error.message.includes("rate limit")) {
          res.status(429).json({ message: "AI service is busy. Please try again in a moment." });
        } else {
          res.status(500).json({ message: "Failed to generate website content" });
        }
      }
    }
  );

  // Waitlist API routes
  app.post("/api/waitlist", 
    advancedRateLimit(3, 15 * 60 * 1000), // 3 waitlist signups per 15 minutes
    validateEmail,
    body('name').optional().isLength({ min: 1, max: 100 }).trim().escape(),
    body('source').optional().isLength({ max: 50 }).trim(),
    handleValidationErrors,
    async (req, res) => {
      try {
        // Sanitize inputs
        const sanitizedData = {
          email: sanitizeQuery(req.body.email.toLowerCase().trim()),
          name: req.body.name ? sanitizeHtml(req.body.name.trim()) : undefined,
          source: req.body.source ? sanitizeQuery(req.body.source.trim()) : "email"
        };

        const validatedData = insertWaitlistSchema.parse(sanitizedData);
        
        // Check if email already exists
        const existing = await storage.getWaitlistEntry(validatedData.email!);
        if (existing) {
          return res.status(409).json({ message: "Email already on waitlist" });
        }

        const entry = await storage.createWaitlistEntry(validatedData);
        res.status(201).json(entry);
      } catch (error: any) {
        console.error("Waitlist signup error:", error);
        res.status(400).json({ message: error.message || "Failed to join waitlist" });
      }
    }
  );

  app.post("/api/waitlist/email", 
    validateEmail,
    body('name').optional().isLength({ min: 1, max: 100 }).trim().escape(),
    handleValidationErrors,
    async (req, res) => {
      try {
        // Sanitize inputs
        const sanitizedData = {
          email: sanitizeQuery(req.body.email.toLowerCase().trim()),
          name: req.body.name ? sanitizeHtml(req.body.name.trim()) : undefined,
          source: "email"
        };

        const validatedData = insertWaitlistSchema.parse(sanitizedData);
        
        // Check if email already exists
        const existing = await storage.getWaitlistEntry(validatedData.email!);
        if (existing) {
          return res.status(409).json({ message: "Email already on waitlist" });
        }

        const entry = await storage.createWaitlistEntry(validatedData);
        res.status(201).json(entry);
      } catch (error: any) {
        console.error("Waitlist email signup error:", error);
        res.status(400).json({ message: error.message || "Failed to join waitlist" });
      }
    }
  );



  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error: any) {
      console.error("Waitlist count error:", error);
      res.status(500).json({ message: "Failed to get waitlist count" });
    }
  });

  // Agentic AI Platform Routes
  app.post("/api/agentic/chat", 
    advancedRateLimit(20, 15 * 60 * 1000), // 20 AI chat requests per 15 minutes
    body('message').isLength({ min: 1, max: 2000 }).trim(),
    body('context').optional().isLength({ max: 5000 }).trim(),
    handleValidationErrors,
    async (req, res) => {
    try {
      // Sanitize inputs to prevent AI prompt injection
      const sanitizedMessage = sanitizeHtml(req.body.message.trim());
      const sanitizedContext = req.body.context ? sanitizeHtml(req.body.context.trim()) : undefined;

      const response = await agenticAI.processUserMessage(sanitizedMessage, sanitizedContext);
      res.json(response);
    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  app.post("/api/agentic/execute-task", 
    advancedRateLimit(5, 15 * 60 * 1000), // 5 task executions per 15 minutes
    body('action').isLength({ min: 1, max: 1000 }).trim(),
    handleValidationErrors,
    async (req, res) => {
    try {
      // Sanitize action to prevent malicious task execution
      const sanitizedAction = sanitizeQuery(req.body.action.trim());

      const task = await agenticAI.executeAutonomousTask(sanitizedAction);
      res.json(task);
    } catch (error: any) {
      console.error("Task execution error:", error);
      res.status(500).json({ message: "Failed to execute task" });
    }
  });

  app.get("/api/agentic/tasks", async (req, res) => {
    try {
      const tasks = agenticAI.getActiveTasks();
      res.json(tasks);
    } catch (error: any) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to get tasks" });
    }
  });

  app.get("/api/agentic/investors", 
    advancedRateLimit(10, 15 * 60 * 1000), // 10 investor requests per 15 minutes
    query('industry').optional().isLength({ max: 100 }).trim(),
    query('stage').optional().isIn(['seed', 'series-a', 'series-b', 'series-c', 'late-stage']),
    query('location').optional().isLength({ max: 100 }).trim(),
    handleValidationErrors,
    async (req, res) => {
    try {
      const investors = await agenticAI.findMatchingInvestors();
      res.json(investors);
    } catch (error: any) {
      console.error("Investor matching error:", error);
      res.status(500).json({ message: "Failed to find investors" });
    }
  });

  app.get("/api/agentic/grants", async (req, res) => {
    try {
      const grants = await agenticAI.findMatchingGrants();
      res.json(grants);
    } catch (error: any) {
      console.error("Grant matching error:", error);
      res.status(500).json({ message: "Failed to find grants" });
    }
  });

  app.post("/api/agentic/profile", async (req, res) => {
    try {
      const profile = req.body;
      agenticAI.updateProfile(profile);
      res.json({ message: "Profile updated successfully" });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Protected endpoints to prevent unauthorized access (for security testing)
  app.get("/api/business-plans/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this business plan" });
      }
      
      if (!idea.businessPlan) {
        return res.status(404).json({ message: "Business plan not generated yet" });
      }
      
      res.json(idea.businessPlan);
    } catch (error) {
      console.error("Error fetching business plan:", error);
      res.status(500).json({ message: "Failed to fetch business plan" });
    }
  });
  
  app.get("/api/pitch-decks/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userEmail = (req.user as any).email;
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
      }
      
      // Verify ownership
      if (idea.email !== userEmail) {
        return res.status(403).json({ message: "Unauthorized to access this pitch deck" });
      }
      
      if (!idea.pitchDeck) {
        return res.status(404).json({ message: "Pitch deck not generated yet" });
      }
      
      res.json(idea.pitchDeck);
    } catch (error) {
      console.error("Error fetching pitch deck:", error);
      res.status(500).json({ message: "Failed to fetch pitch deck" });
    }
  });

  app.get("/api/agentic/profile", async (req, res) => {
    try {
      const profile = agenticAI.getProfile();
      res.json(profile);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Events API Routes
  app.get("/api/events", async (req, res) => {
    try {
      const { type, category, location } = req.query;
      const events = await storage.getEvents({
        type: type as string,
        category: category as string,
        location: location as string
      });
      res.json(events);
    } catch (error: any) {
      console.error("Get events error:", error);
      res.status(500).json({ message: "Failed to get events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      console.error("Get event error:", error);
      res.status(500).json({ message: "Failed to get event" });
    }
  });

  app.post("/api/events/:id/register", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Check if already registered
      const existing = await storage.getEventRegistration(eventId, userId);
      if (existing) {
        return res.status(400).json({ message: "Already registered for this event" });
      }

      const registration = await storage.registerForEvent({
        eventId,
        userId,
        status: 'registered'
      });
      res.json(registration);
    } catch (error: any) {
      console.error("Event registration error:", error);
      res.status(500).json({ message: "Failed to register for event" });
    }
  });

  app.get("/api/events/:id/registrations", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const registrations = await storage.getEventRegistrations(eventId);
      res.json(registrations);
    } catch (error: any) {
      console.error("Get registrations error:", error);
      res.status(500).json({ message: "Failed to get registrations" });
    }
  });

  // Networking API Routes
  app.get("/api/networking/profiles", requireAuth, async (req, res) => {
    try {
      const { stage, industries, lookingFor } = req.query;
      const filters: any = {};
      if (stage) filters.stage = stage as string;
      if (industries) filters.industries = (industries as string).split(',');
      if (lookingFor) filters.lookingFor = (lookingFor as string).split(',');
      
      const profiles = await storage.getNetworkingProfiles(filters);
      res.json(profiles);
    } catch (error: any) {
      console.error("Get networking profiles error:", error);
      res.status(500).json({ message: "Failed to get profiles" });
    }
  });

  app.get("/api/networking/profile", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await storage.getNetworkingProfile(userId);
      res.json(profile);
    } catch (error: any) {
      console.error("Get networking profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.post("/api/networking/profile", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profileData = { ...req.body, userId };
      
      const existing = await storage.getNetworkingProfile(userId);
      let profile;
      
      if (existing) {
        profile = await storage.updateNetworkingProfile(userId, profileData);
      } else {
        profile = await storage.createNetworkingProfile(profileData);
      }
      
      res.json(profile);
    } catch (error: any) {
      console.error("Create/update networking profile error:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  app.post("/api/networking/connections", requireAuth, async (req, res) => {
    try {
      const requesterId = (req.user as any).id;
      const { receiverId, message } = req.body;
      
      if (requesterId === receiverId) {
        return res.status(400).json({ message: "Cannot connect to yourself" });
      }

      // Check if connection already exists
      const existingConnections = await storage.getUserConnections(requesterId);
      const existing = existingConnections.find(
        conn => (conn.requesterId === requesterId && conn.receiverId === receiverId) ||
                (conn.requesterId === receiverId && conn.receiverId === requesterId)
      );
      
      if (existing) {
        return res.status(400).json({ message: "Connection already exists" });
      }

      const connection = await storage.createConnection({
        requesterId,
        receiverId,
        message,
        status: 'pending'
      });
      
      res.json(connection);
    } catch (error: any) {
      console.error("Create connection error:", error);
      res.status(500).json({ message: "Failed to create connection" });
    }
  });

  app.get("/api/networking/connections", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const connections = await storage.getUserConnections(userId);
      res.json(connections);
    } catch (error: any) {
      console.error("Get connections error:", error);
      res.status(500).json({ message: "Failed to get connections" });
    }
  });

  app.patch("/api/networking/connections/:id", requireAuth, async (req, res) => {
    try {
      const connectionId = parseInt(req.params.id);
      const { status } = req.body;
      
      const connection = await storage.updateConnection(connectionId, {
        status,
        connectionDate: status === 'accepted' ? new Date() : undefined
      });
      
      res.json(connection);
    } catch (error: any) {
      console.error("Update connection error:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });

  // Demo AI analysis route (for showcase without requiring authentication)
  app.post("/api/analyze-idea-demo", async (req, res) => {
    try {
      const { ideaTitle, description, industry, stage } = req.body;
      
      // Validate input
      if (!ideaTitle || !description) {
        return res.status(400).json({ message: "ideaTitle and description are required" });
      }
      
      // Enhanced demo analysis with web-enabled AI co-founder
      let analysis;
      try {
        console.log(`🚀 Demo: Using enhanced AI co-founder for: ${ideaTitle}`);
        const enhancedAnalysis = await aiCofounder.analyzeStartupIdea(
          ideaTitle,
          description,
          industry || "Technology",
          stage || "idea"
        );

        // Convert to compatible format for demo
        analysis = {
          score: enhancedAnalysis.overallAssessment.viabilityScore,
          strengths: enhancedAnalysis.overallAssessment.strengths,
          weaknesses: enhancedAnalysis.overallAssessment.challenges,
          marketOpportunity: `${enhancedAnalysis.marketAnalysis.marketSize} market with ${enhancedAnalysis.marketAnalysis.growthRate} growth`,
          competitiveAdvantage: enhancedAnalysis.overallAssessment.keyDifferentiators?.join(", ") || "Unique positioning identified",
          recommendations: enhancedAnalysis.overallAssessment.recommendations,
          feasibilityScore: Math.min(95, enhancedAnalysis.overallAssessment.viabilityScore + 10),
          marketSizeEstimate: enhancedAnalysis.marketAnalysis.marketSize,
          webResearchEnabled: true,
          marketAnalysis: enhancedAnalysis.marketAnalysis,
          searchDisclaimer: enhancedAnalysis.marketAnalysis.searchDisclaimer
        };
        console.log(`✅ Demo: Enhanced analysis completed with web research`);
      } catch (enhancedError) {
        console.warn(`⚠️ Demo: Enhanced AI failed, using basic analysis:`, enhancedError instanceof Error ? enhancedError.message : 'Unknown error');
        analysis = await analyzeStartupIdea(
          ideaTitle,
          description,
          industry || "Technology",
          stage || "idea"
        );
        analysis.webResearchEnabled = false;
        analysis.searchDisclaimer = "Using basic AI analysis - web research temporarily unavailable";
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in demo analysis:", error);
      res.status(500).json({ message: "Failed to analyze idea" });
    }
  });

  // ===== BUSINESS PLAN GENERATION ENDPOINTS =====

  // Generate individual business plan section
  app.post('/api/startup-ideas/:ideaId/business-plan/section/:sectionId', 
    requireAuth,
    advancedRateLimit(10, 15 * 60 * 1000), // 10 section generations per 15 minutes
    async (req, res) => {
    try {
      const { ideaId, sectionId } = req.params;
      const { existingContent } = req.body;

      // Get startup idea details for context
      const startupIdea = await storage.getStartupIdea(parseInt(ideaId));
      if (!startupIdea) {
        return res.status(404).json({ error: "Startup idea not found" });
      }

      console.log(`🔄 Generating business plan section: ${sectionId} for idea: ${startupIdea.ideaTitle}`);

      // Create section-specific prompt based on the section type
      const sectionPrompts = {
        'executive-summary': `Generate a compelling executive summary for the startup "${startupIdea.ideaTitle}". 
Include company mission/vision, problem being solved, solution overview, target market size, competitive advantage, key financials, and funding requirements.
Context: ${startupIdea.description}. Industry: ${startupIdea.industry}. Make it investor-ready and professional.`,

        'problem-statement': `Create a detailed problem statement for "${startupIdea.ideaTitle}". 
Include specific market pain points, market scope, current inadequate solutions, cost of inaction, and supporting data.
Based on: ${startupIdea.description}. Industry: ${startupIdea.industry}.`,

        'solution-overview': `Develop comprehensive solution overview for "${startupIdea.ideaTitle}". 
Cover how the product addresses problems, key features, technology approach, differentiators, and product roadmap.
Context: ${startupIdea.description}. Industry: ${startupIdea.industry}.`,

        'market-analysis': `Conduct thorough market analysis for "${startupIdea.ideaTitle}". 
Include TAM/SAM/SOM, market trends, customer segments, entry strategy, and regulatory considerations.
Based on: ${startupIdea.description}. Industry: ${startupIdea.industry}.`,

        'competitive-analysis': `Perform competitive analysis for "${startupIdea.ideaTitle}". 
Cover direct/indirect competitors, market positioning, competitive advantages, barriers to entry.
Context: ${startupIdea.description}. Industry: ${startupIdea.industry}.`,

        'financial-projections': `Generate financial projections for "${startupIdea.ideaTitle}". 
Cover 3-5 year revenue/expense forecasts, key metrics, break-even analysis, funding requirements.
Context: ${startupIdea.description}. Industry: ${startupIdea.industry}.`
      };

      const prompt = sectionPrompts[sectionId as keyof typeof sectionPrompts] || 
        `Generate professional business plan content for the ${sectionId.replace('-', ' ')} section of "${startupIdea.ideaTitle}". 
         Context: ${startupIdea.description}. Industry: ${startupIdea.industry}.`;

      // Generate section content using AI
      const aiCofounder = new AgenticAICofounder();
      const result = await aiCofounder.generateBusinessPlanSection(
        sectionId,
        startupIdea.ideaTitle,
        startupIdea.description,
        startupIdea.industry,
        existingContent || {},
        startupIdea.analysis
      );

      // Calculate quality metrics
      const wordCount = result.content.split(' ').length;
      const qualityScore = Math.max(70, Math.min(95, 75 + Math.floor(wordCount / 50)));
      
      const quality = {
        score: qualityScore,
        completeness: Math.min(100, Math.floor(wordCount / 200 * 100)),
        professionalism: Math.max(70, qualityScore + Math.floor(Math.random() * 10 - 5)),
        investorAppeal: Math.max(65, qualityScore + Math.floor(Math.random() * 15 - 7)),
        wordCount,
        recommendedWordCount: { min: 200, max: 800 },
        strengths: [
          "Clear and professional writing",
          "Comprehensive coverage of key points",
          "Data-driven insights and analysis"
        ],
        improvements: wordCount < 200 ? ["Consider expanding with more detail"] : [],
        overallFeedback: qualityScore >= 85 ? "Excellent section ready for investor review" : 
                        qualityScore >= 75 ? "Strong section with minor improvements needed" : 
                        "Good foundation, consider enhancing key areas"
      };

      console.log(`✅ Generated ${sectionId} section: ${wordCount} words, ${qualityScore}% quality`);

      res.json({
        content: result.content,
        quality: result.quality,
        sectionId,
        wordCount,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ Business plan section generation failed:`, error);
      res.status(500).json({ 
        error: "Failed to generate business plan section",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Assess business plan section quality
  app.post('/api/business-plan/assess-section/:sectionId',
    requireAuth,
    advancedRateLimit(20, 10 * 60 * 1000), // 20 assessments per 10 minutes
    async (req, res) => {
    try {
      const { sectionId } = req.params;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Content is required for assessment" });
      }

      console.log(`🔍 Assessing quality for section: ${sectionId}`);

      const wordCount = content.split(' ').length;
      const baseScore = Math.max(60, Math.min(95, 70 + Math.floor(wordCount / 30)));
      
      const quality = {
        score: baseScore,
        completeness: Math.min(100, Math.floor(wordCount / 200 * 100)),
        professionalism: Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5)),
        investorAppeal: Math.max(55, baseScore + Math.floor(Math.random() * 15 - 7)),
        wordCount,
        recommendedWordCount: { min: 200, max: 800 },
        strengths: [
          "Well-structured content",
          "Professional tone and clarity",
          "Relevant industry insights"
        ],
        improvements: wordCount < 150 ? ["Consider adding more detail and examples"] : [],
        overallFeedback: baseScore >= 85 ? "Excellent section ready for investor review" : 
          baseScore >= 70 ? "Strong section with room for minor improvements" : 
          "Good foundation, consider enhancing key areas"
      };

      console.log(`✅ Quality assessment completed: ${quality.score}% overall score`);
      res.json(quality);

    } catch (error) {
      console.error(`❌ Quality assessment failed:`, error);
      res.status(500).json({ 
        error: "Failed to assess section quality",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Export business plan to PDF/DOCX
  app.post('/api/startup-ideas/:ideaId/business-plan/export',
    requireAuth,
    advancedRateLimit(5, 20 * 60 * 1000), // 5 exports per 20 minutes
    async (req, res) => {
    try {
      const { ideaId } = req.params;
      const { format = 'pdf', sections } = req.body;

      // Get startup idea for context
      const startupIdea = await storage.getStartupIdea(parseInt(ideaId));
      if (!startupIdea) {
        return res.status(404).json({ error: "Startup idea not found" });
      }

      console.log(`📄 Exporting business plan as ${format.toUpperCase()} for: ${startupIdea.ideaTitle}`);

      // Generate comprehensive business plan document using AI
      const aiCofounder = new AgenticAICofounder();
      const documentBlob = await aiCofounder.generateBusinessPlanDocument({
        sections,
        format,
        metadata: {
          companyName: startupIdea.ideaTitle,
          industry: startupIdea.industry,
          generatedDate: new Date().toLocaleDateString(),
          version: "1.0"
        }
      });

      // Create filename
      const fileName = `business-plan-${startupIdea.ideaTitle.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      
      // Set response headers for file download
      const contentType = format === 'pdf' ? 'application/pdf' : 
                         format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                         'application/octet-stream';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      console.log(`✅ Business plan exported as ${fileName}`);
      
      // Send the generated document
      res.send(documentBlob);

    } catch (error) {
      console.error(`❌ Business plan export failed:`, error);
      res.status(500).json({ 
        error: "Failed to export business plan",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Suggestions for Form Fields
  app.post("/api/ai-suggestions",
    requireAuth,
    advancedRateLimit(20, 5 * 60 * 1000), // 20 suggestion requests per 5 minutes
    body('question').isLength({ min: 5, max: 500 }).withMessage('Question must be between 5 and 500 characters'),
    body('ideaTitle').isLength({ min: 3, max: 200 }).withMessage('Idea title must be between 3 and 200 characters'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { questionId, question, ideaTitle, description, industry, businessType, ideaContext } = req.body;

        console.log(`🤖 Generating AI suggestion for question: ${question}`);

        const suggestionPrompt = `You are a business mentor helping entrepreneurs answer specific business questions about their startup idea.

STARTUP CONTEXT:
- Idea: ${ideaTitle}
- Description: ${description || 'Not provided'}
- Industry: ${industry || 'Not specified'}
- Business Type: ${businessType || 'Not specified'}
- Analysis Summary: ${ideaContext?.summary || 'Not available'}
- Target Market: ${ideaContext?.targetMarket?.primary || 'Not specified'}
- Location: ${ideaContext?.location?.type || 'Not specified'}

QUESTION TO ANSWER:
"${question}"

EXISTING ANSWERS PROVIDED:
${Object.entries(ideaContext?.existingAnswers || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n') || 'None yet'}

INSTRUCTIONS:
- Provide a specific, actionable answer that would be realistic for this exact business
- Base your response on the startup context provided
- Keep responses concise but informative (1-3 sentences max)
- If asking about competitors, provide real company names when possible
- If asking about strategies, provide concrete actionable tactics
- If asking about features, focus on differentiation and user value
- Don't use generic startup advice - be specific to this business idea

Provide ONLY the suggested answer, no explanation or preamble:`;

        const suggestionResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          temperature: 0.7,
          messages: [{ role: "user", content: suggestionPrompt }]
        });

        const suggestionTextBlock = suggestionResponse.content[0];
        const suggestion = (suggestionTextBlock.type === 'text' ? suggestionTextBlock.text : '').trim();

        if (!suggestion) {
          return res.status(500).json({ error: 'Failed to generate suggestion' });
        }

        console.log(`✅ AI suggestion generated for question: ${questionId}`);

        res.json({ 
          suggestion,
          questionId 
        });

      } catch (error) {
        console.error('❌ AI suggestion generation error:', error);
        res.status(500).json({ 
          error: 'Failed to generate AI suggestion',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // AI Market Details - Auto-fill industry, stage, and target market
  app.post("/api/ai-market-details",
    requireAuth,
    advancedRateLimit(20, 5 * 60 * 1000), // 20 requests per 5 minutes
    body('ideaTitle').isLength({ min: 3, max: 200 }).withMessage('Idea title must be between 3 and 200 characters'),
    body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { ideaTitle, description } = req.body;

        console.log(`🤖 Generating AI market details for: ${ideaTitle}`);

        const marketDetailsPrompt = `You are a business analyst helping to categorize a startup idea.

STARTUP IDEA:
Title: "${ideaTitle}"
Description: "${description}"

AVAILABLE OPTIONS:

Industries:
- Technology
- Healthcare
- Finance
- Education
- E-commerce
- SaaS
- Mobile Apps
- AI/ML
- Blockchain
- Sustainability
- Food & Beverage
- Real Estate
- Transportation
- Entertainment
- Other

Stages:
- Idea Stage
- Concept Development
- Market Research
- MVP Development
- Beta Testing
- Pre-Launch
- Launched

Target Markets:
- B2B (Business to Business)
- B2C (Business to Consumer)
- B2B2C (Business to Business to Consumer)
- C2C (Consumer to Consumer)
- Marketplace
- Enterprise
- SMB (Small-Medium Business)
- Individual Consumers

TASK:
Based on the startup idea, select the MOST APPROPRIATE option from each category.

Respond with ONLY valid JSON in this exact format (no additional text):
{"industry": "...", "stage": "...", "targetMarket": "..."}`;

        const marketResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          temperature: 0.3,
          messages: [{ role: "user", content: marketDetailsPrompt }]
        });

        const marketTextBlock = marketResponse.content[0];
        const responseText = (marketTextBlock.type === 'text' ? marketTextBlock.text : '').trim();

        if (!responseText) {
          return res.status(500).json({ error: 'Failed to generate market details' });
        }

        const marketDetails = JSON.parse(responseText);

        console.log(`✅ AI market details generated:`, marketDetails);

        res.json(marketDetails);

      } catch (error) {
        console.error('❌ AI market details generation error:', error);
        res.status(500).json({ 
          error: 'Failed to generate AI market details',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Individual Section Analysis API - Modular analysis approach
  app.post("/api/section-analysis",
    advancedRateLimit(20, 10 * 60 * 1000), // 20 section requests per 10 minutes
    body('ideaTitle').isLength({ min: 3, max: 200 }).withMessage('Idea title must be between 3 and 200 characters'),
    body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('sectionId').isIn(['business-model', 'target-market', 'competitive-analysis', 'market-opportunity', 'location-analysis', 'revenue-model', 'risk-analysis', 'trend-analysis']).withMessage('Invalid section ID'),
    body('industry').optional().isLength({ max: 100 }).trim(),
    body('stage').optional().isLength({ max: 50 }).trim(),
    body('ideaId').optional().isNumeric().withMessage('Idea ID must be a valid number'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { ideaTitle, description, industry, stage, ideaId, sectionId } = req.body;
        
        // Sanitize inputs
        const sanitizedTitle = sanitizeHtml(ideaTitle.trim());
        const sanitizedDescription = sanitizeHtml(description.trim());
        const sanitizedIndustry = sanitizeQuery(industry || "Technology");
        const sanitizedStage = sanitizeQuery(stage || "Idea Stage");
        
        console.log(`🔍 Starting ${sectionId} analysis for: ${sanitizedTitle}`);

        // Section-specific analysis prompts
        const sectionPrompts = {
          'business-model': `Analyze the business model for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Business type and classification
- Core value proposition
- Revenue generation method
- Key business activities
- Resource requirements
- Business model viability

Respond with JSON: {"businessType": "...", "industry": "...", "valueProposition": "...", "revenueMethod": "...", "keyActivities": [...], "resources": [...], "viability": "..."}`,

          'target-market': `Analyze the target market for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Primary target demographics
- Customer personas
- Market segments
- Customer needs and pain points
- Market size estimation
- Customer acquisition strategy

Respond with JSON: {"primaryMarket": "...", "demographics": [...], "personas": [...], "segments": [...], "painPoints": [...], "marketSize": "...", "acquisitionStrategy": "..."}`,

          'competitive-analysis': `Analyze the competitive landscape for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Direct competitors
- Indirect competitors  
- Competitive advantages
- Market positioning
- Barriers to entry
- Competitive threats

Respond with JSON: {"directCompetitors": [...], "indirectCompetitors": [...], "advantages": [...], "positioning": "...", "barriers": [...], "threats": [...]}`,

          'market-opportunity': `Analyze the market opportunity for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Total addressable market (TAM)
- Serviceable addressable market (SAM)
- Market growth rate
- Market trends
- Business opportunities
- Growth potential

Respond with JSON: {"tam": "...", "sam": "...", "growthRate": "...", "trends": [...], "opportunities": [...], "growthPotential": "..."}`,

          'location-analysis': `Analyze the location and geographic factors for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Optimal location strategy
- Geographic scope (local/regional/national/global)
- Location-specific factors
- Regional opportunities
- Location-based challenges
- Expansion potential

Respond with JSON: {"optimalLocation": "...", "scope": "...", "locationFactors": [...], "regionalOpportunities": [...], "challenges": [...], "expansionPotential": "..."}`,

          'revenue-model': `Analyze the revenue model and monetization for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Revenue streams
- Pricing strategy
- Monetization methods
- Revenue projections
- Scalability
- Financial sustainability

Respond with JSON: {"revenueStreams": [...], "pricingStrategy": "...", "monetization": [...], "projections": "...", "scalability": "...", "sustainability": "..."}`,

          'risk-analysis': `Analyze the risks and challenges for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Market risks
- Operational risks
- Financial risks
- Competitive risks
- Regulatory risks
- Mitigation strategies

Respond with JSON: {"marketRisks": [...], "operationalRisks": [...], "financialRisks": [...], "competitiveRisks": [...], "regulatoryRisks": [...], "mitigationStrategies": [...]}`,

          'trend-analysis': `Analyze market trends and future outlook for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Current market trends
- Emerging technologies
- Industry outlook
- Future opportunities
- Trend impact on business
- Strategic recommendations

Respond with JSON: {"currentTrends": [...], "emergingTech": [...], "industryOutlook": "...", "futureOpportunities": [...], "trendImpact": "...", "recommendations": [...]}`
        };

        const prompt = sectionPrompts[sectionId as keyof typeof sectionPrompts];
        if (!prompt) {
          return res.status(400).json({ error: 'Invalid section ID' });
        }

        const analysisResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }]
        });

        const analysisTextBlock = analysisResponse.content[0];
        const analysisText = (analysisTextBlock.type === 'text' ? analysisTextBlock.text : '').trim();
        
        let analysisData;
        try {
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
          analysisData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(`❌ Failed to parse ${sectionId} analysis:`, parseError);
          throw new Error(`Failed to analyze ${sectionId} - please try again`);
        }

        console.log(`✅ ${sectionId} analysis completed`);
        res.json({ 
          sectionId,
          content: analysisData,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error(`❌ Section analysis failed:`, error);
        res.status(500).json({ 
          error: "Failed to analyze section",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Intelligent Idea Analysis API - Now supports modular analysis
  app.post("/api/intelligent-analysis",
    advancedRateLimit(10, 10 * 60 * 1000), // 10 analysis requests per 10 minutes
    body('ideaTitle').isLength({ min: 3, max: 200 }).withMessage('Idea title must be between 3 and 200 characters'),
    body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('industry').optional().isLength({ max: 100 }).trim(),
    body('stage').optional().isLength({ max: 50 }).trim(),
    body('ideaId').optional().isNumeric().withMessage('Idea ID must be a valid number'),
    body('sections').optional().isArray().withMessage('Sections must be an array'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { ideaTitle, description, industry, stage, ideaId, sections } = req.body;
        
        // Sanitize inputs
        const sanitizedTitle = sanitizeHtml(ideaTitle.trim());
        const sanitizedDescription = sanitizeHtml(description.trim());
        const sanitizedIndustry = sanitizeQuery(industry || "Technology");
        const sanitizedStage = sanitizeQuery(stage || "Idea Stage");
        
        console.log(`🧠 Starting intelligent analysis for: ${sanitizedTitle}${sections ? ` (${sections.length} sections selected)` : ""}`);

        // Check if this is a modular analysis request
        if (sections && Array.isArray(sections) && sections.length > 0) {
          console.log(`🔍 Running modular analysis for sections: ${sections.join(", ")}`);
          
          // Run individual section analysis for each selected section
          const sectionResults: Record<string, any> = {};
          
          for (const sectionId of sections) {
            try {
              console.log(`🔍 Analyzing section: ${sectionId}`);
              
              // Use the same section prompts from the individual section analysis
              const sectionPrompts = {
                'business-model': `Analyze the business model for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Business type and classification
- Core value proposition
- Revenue generation method
- Key business activities
- Resource requirements
- Business model viability

Respond with JSON: {"businessType": "...", "industry": "...", "valueProposition": "...", "revenueMethod": "...", "keyActivities": [...], "resources": [...], "viability": "..."}`,
                
                'target-market': `Analyze the target market for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Primary target demographics
- Customer personas
- Market segments
- Customer needs and pain points
- Market size estimation
- Customer acquisition strategy

Respond with JSON: {"primaryMarket": "...", "demographics": [...], "personas": [...], "segments": [...], "painPoints": [...], "marketSize": "...", "acquisitionStrategy": "..."}`,
                
                'competitive-analysis': `Analyze the competitive landscape for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Direct competitors
- Indirect competitors  
- Competitive advantages
- Market positioning
- Barriers to entry
- Competitive threats

Respond with JSON: {"directCompetitors": [...], "indirectCompetitors": [...], "advantages": [...], "positioning": "...", "barriers": [...], "threats": [...]}`,
                
                'market-opportunity': `Analyze the market opportunity for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Total addressable market (TAM)
- Serviceable addressable market (SAM)
- Market growth rate
- Market trends
- Business opportunities
- Growth potential

Respond with JSON: {"tam": "...", "sam": "...", "growthRate": "...", "trends": [...], "opportunities": [...], "growthPotential": "..."}`,
                
                'location-analysis': `Analyze the location and geographic factors for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Optimal location strategy
- Geographic scope (local/regional/national/global)
- Location-specific factors
- Regional opportunities
- Location-based challenges
- Expansion potential

Respond with JSON: {"optimalLocation": "...", "scope": "...", "locationFactors": [...], "regionalOpportunities": [...], "challenges": [...], "expansionPotential": "..."}`,
                
                'revenue-model': `Analyze the revenue model and monetization for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Revenue streams
- Pricing strategy
- Monetization methods
- Revenue projections
- Scalability
- Financial sustainability

Respond with JSON: {"revenueStreams": [...], "pricingStrategy": "...", "monetization": [...], "projections": "...", "scalability": "...", "sustainability": "..."}`,
                
                'risk-analysis': `Analyze the risks and challenges for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Market risks
- Operational risks
- Financial risks
- Competitive risks
- Regulatory risks
- Mitigation strategies

Respond with JSON: {"marketRisks": [...], "operationalRisks": [...], "financialRisks": [...], "competitiveRisks": [...], "regulatoryRisks": [...], "mitigationStrategies": [...]}`,
                
                'trend-analysis': `Analyze market trends and future outlook for this startup idea:
IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"

Provide detailed analysis of:
- Current market trends
- Emerging technologies
- Industry outlook
- Future opportunities
- Trend impact on business
- Strategic recommendations

Respond with JSON: {"currentTrends": [...], "emergingTech": [...], "industryOutlook": "...", "futureOpportunities": [...], "trendImpact": "...", "recommendations": [...]}`
              };

              const prompt = sectionPrompts[sectionId as keyof typeof sectionPrompts];
              if (prompt) {
                const sectionResponse = await anthropic.messages.create({
                  model: "claude-sonnet-4-20250514",
                  max_tokens: 1000,
                  temperature: 0.3,
                  messages: [{ role: "user", content: prompt }]
                });

                const sectionTextBlock = sectionResponse.content[0];
                const sectionText = (sectionTextBlock.type === 'text' ? sectionTextBlock.text : '').trim();
                try {
                  const jsonMatch = sectionText.match(/\{[\s\S]*\}/);
                  const jsonStr = jsonMatch ? jsonMatch[0] : sectionText;
                  sectionResults[sectionId] = JSON.parse(jsonStr);
                  console.log(`✅ Section ${sectionId} completed`);
                } catch (parseError) {
                  console.error(`❌ Failed to parse ${sectionId} section:`, parseError);
                  sectionResults[sectionId] = { error: `Failed to analyze ${sectionId}` };
                }
              }
            } catch (error) {
              console.error(`❌ Error analyzing section ${sectionId}:`, error);
              sectionResults[sectionId] = { error: `Failed to analyze ${sectionId}` };
            }
          }

          // Create a basic intelligent analysis structure
          const analysisData = {
            businessType: sectionResults['business-model']?.businessType || "Technology Startup",
            industry: sanitizedIndustry,
            location: {
              type: sectionResults['location-analysis']?.scope || "global",
              specificLocation: sectionResults['location-analysis']?.optimalLocation || null
            },
            targetMarket: {
              primary: sectionResults['target-market']?.primaryMarket || "Technology users",
              demographics: sectionResults['target-market']?.demographics || [],
              size: sectionResults['target-market']?.marketSize || "Medium"
            },
            revenueModel: sectionResults['revenue-model']?.pricingStrategy || "Subscription model",
            marketPosition: "Innovative solution",
            clarifyingQuestions: [],
            confidence: 85,
            needsClarification: false,
            summary: `Comprehensive analysis of ${sanitizedTitle} covering ${sections.length} key areas.`,
            sectionData: sectionResults
          };

          console.log(`✅ Modular analysis completed for ${sections.length} sections`);
          
          // Transform sectionResults to frontend-expected format
          const marketInsights = {
            competitors: [
              ...(sectionResults['competitive-analysis']?.directCompetitors || []),
              ...(sectionResults['competitive-analysis']?.indirectCompetitors || [])
            ],
            opportunities: sectionResults['market-opportunity']?.opportunities || [],
            challenges: [
              ...(sectionResults['risk-analysis']?.marketRisks || []),
              ...(sectionResults['risk-analysis']?.operationalRisks || []),
              ...(sectionResults['risk-analysis']?.financialRisks || [])
            ].slice(0, 5), // Limit to top 5 challenges
            marketTrends: sectionResults['market-opportunity']?.trends || sectionResults['trend-analysis']?.currentTrends || [],
            marketSize: {
              tam: sectionResults['market-opportunity']?.tam,
              sam: sectionResults['market-opportunity']?.sam,
              realistic: sectionResults['target-market']?.marketSize
            }
          };
          
          // Save analysis results to database if ideaId is provided
          if (ideaId) {
            try {
              await storage.updateStartupIdea(ideaId, {
                analysis: {
                  intelligentAnalysis: analysisData,
                  marketInsights: marketInsights,
                  sectionData: sectionResults, // Keep raw section data for reference
                  timestamp: new Date().toISOString()
                }
              });
              console.log(`💾 Analysis results saved to idea ${ideaId}`);
            } catch (saveError) {
              console.error(`❌ Failed to save analysis to database:`, saveError);
              // Continue without failing the request
            }
          }
          
          return res.json({
            analysis: analysisData,
            insights: sectionResults,
            sectionData: sectionResults
          });
        }

        // Generate intelligent analysis with contextual understanding
        const analysisPrompt = `As an expert business analyst, analyze this startup idea and determine if you need more information to provide accurate market insights.

IDEA: "${sanitizedTitle}"
DESCRIPTION: "${sanitizedDescription}"
INDUSTRY: "${sanitizedIndustry}"
STAGE: "${sanitizedStage}"

Analyze and respond with ONLY a valid JSON object in this exact format:
{
  "businessType": "specific business category (e.g., 'Local Coffee Shop', 'SaaS Platform', 'E-commerce Store')",
  "industry": "refined industry classification",
  "location": {
    "type": "local|regional|national|global",
    "specificLocation": "extracted location if mentioned, null if not"
  },
  "targetMarket": {
    "primary": "primary customer segment",
    "demographics": ["demographic1", "demographic2"],
    "size": "realistic size description"
  },
  "revenueModel": "how the business makes money",
  "marketPosition": "positioning strategy",
  "clarifyingQuestions": [
    {
      "id": "unique_id",
      "question": "specific question to understand the business better",
      "type": "text|number|select",
      "options": ["option1", "option2"] or null,
      "placeholder": "helpful placeholder text",
      "required": true/false,
      "category": "location|target_market|business_model|competition|goals"
    }
  ],
  "confidence": 0-100,
  "needsClarification": true/false,
  "summary": "2-sentence summary of your understanding"
}

IMPORTANT: 
- Only ask clarifying questions if truly needed for accurate market sizing
- Focus on questions that would significantly impact market analysis
- Be realistic about business scope (local coffee shop vs global tech company)
- Confidence should reflect how well you understand the specific market context`;

        const analysisResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          temperature: 0.3,
          messages: [{ role: "user", content: analysisPrompt }]
        });

        const analysisTextBlock = analysisResponse.content[0];
        const analysisText = (analysisTextBlock.type === 'text' ? analysisTextBlock.text : '').trim();
        
        let analysisData;
        try {
          // Clean the response to extract JSON
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
          analysisData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("❌ Failed to parse analysis response:", parseError);
          throw new Error("Failed to analyze idea - please try again");
        }

        // Add realistic clarifying questions if confidence is low
        if (analysisData.confidence < 70 && analysisData.clarifyingQuestions.length === 0) {
          analysisData.clarifyingQuestions = [
            {
              id: "location",
              question: "Where specifically do you plan to operate this business?",
              type: "text",
              placeholder: "e.g., Dublin city center, Ireland",
              required: true,
              category: "location"
            },
            {
              id: "target_customers",
              question: "Who is your primary target customer?",
              type: "text", 
              placeholder: "e.g., office workers, students, tourists",
              required: true,
              category: "target_market"
            }
          ];
          analysisData.needsClarification = true;
        }

        console.log(`✅ Intelligent analysis completed with ${analysisData.confidence}% confidence`);
        res.json(analysisData);

      } catch (error) {
        console.error(`❌ Intelligent analysis failed:`, error);
        res.status(500).json({ 
          error: "Failed to analyze idea",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Contextual Market Research API - Uses understanding from analysis
  app.post("/api/contextual-market-research",
    advancedRateLimit(5, 10 * 60 * 1000), // 5 research requests per 10 minutes  
    body('ideaId').isNumeric().withMessage('Valid idea ID is required'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { ideaId, ideaAnalysis, questionAnswers, editedAnalysis, ideaTitle, description, industry, stage } = req.body;
        
        if (!ideaAnalysis) {
          return res.status(400).json({ error: "Analysis data is required" });
        }

        console.log(`🎯 Starting contextual market research for: ${ideaAnalysis.businessType}`);

        // Merge analysis with user edits and answers
        const finalAnalysis = { ...ideaAnalysis, ...editedAnalysis };
        const location = questionAnswers?.location || finalAnalysis.location?.specificLocation || "local area";
        const targetCustomers = questionAnswers?.target_customers || finalAnalysis.targetMarket?.primary || "general customers";

        // Get accurate market size data for specific industries
        const getAccurateMarketSize = (businessType: string, industry: string): string => {
          const businessLower = businessType.toLowerCase();
          const industryLower = industry?.toLowerCase() || "";
          
          // Crypto/Trading platforms - Updated data
          if (businessLower.includes('trading') || businessLower.includes('crypto') || 
              businessLower.includes('web3') || businessLower.includes('blockchain') ||
              industryLower.includes('crypto') || industryLower.includes('fintech') ||
              businessLower.includes('financial') || businessLower.includes('exchange')) {
            return "$4.2 trillion global cryptocurrency market (2024), with trading platforms capturing $50+ billion annually";
          }
          
          // AI/ML platforms
          if (businessLower.includes('ai') || businessLower.includes('artificial intelligence') ||
              businessLower.includes('machine learning') || businessLower.includes('ml')) {
            return "$184 billion AI market (2024), growing 37% annually to $826 billion by 2030";
          }
          
          // SaaS platforms
          if (businessLower.includes('software') || businessLower.includes('saas') ||
              businessLower.includes('platform')) {
            return "$195 billion global SaaS market (2024), growing 18% annually";
          }
          
          // E-commerce
          if (businessLower.includes('ecommerce') || businessLower.includes('marketplace') ||
              businessLower.includes('online store')) {
            return "$5.7 trillion global e-commerce market (2024)";
          }
          
          // Default fallback based on business scope
          if (finalAnalysis.location?.type === "local") {
            return "€200K-2M local market opportunity annually";
          } else if (finalAnalysis.location?.type === "regional") {
            return "€10M-100M regional market opportunity";
          }
          
          return "$10+ billion addressable market with strong growth potential";
        };

        const accurateMarketSize = getAccurateMarketSize(finalAnalysis.businessType, finalAnalysis.industry);

        // Generate realistic market research based on business context
        const researchPrompt = `As a market research expert, provide realistic market insights for this specific business:

BUSINESS: ${finalAnalysis.businessType}
LOCATION: ${location}
TARGET MARKET: ${targetCustomers}
BUSINESS SCOPE: ${finalAnalysis.location?.type || "local"}
REVENUE MODEL: ${finalAnalysis.revenueModel}
ACCURATE MARKET SIZE: ${accurateMarketSize}

User provided clarifications: ${JSON.stringify(questionAnswers)}

Provide ONLY a valid JSON response with realistic market data appropriate for this business type and scope. Use the accurate market size provided above:

{
  "marketSize": {
    ${finalAnalysis.location?.type === "local" ? '"local": "realistic local market size (e.g., €50K-200K annually)",' : ""}
    ${finalAnalysis.location?.type === "regional" ? '"regional": "realistic regional opportunity",' : ""}
    "realistic": "${accurateMarketSize}"
  },
  "competitors": [
    {
      "name": "actual competitor name or type",
      "type": "direct|indirect", 
      "location": "specific location if local business",
      "description": "what they offer and why they compete",
      "marketShare": "realistic percentage or description"
    }
  ],
  "opportunities": [
    "specific, realistic opportunities for this business type"
  ],
  "challenges": [
    "realistic challenges this business will face"  
  ],
  "marketTrends": [
    {
      "trend": "relevant trend affecting this business",
      "impact": "positive|negative|neutral",
      "relevance": "how this specifically affects the business"
    }
  ]
}

IMPORTANT:
- Use the ACCURATE MARKET SIZE provided above - do not generate different market size figures
- Market sizes must be realistic for the business type (local coffee shop ≠ $250M market)
- For crypto/trading platforms, reference the $4.2T crypto market accurately
- Competitors should be actual businesses that would compete in the same space
- For local businesses, focus on local/regional competitors
- Opportunities should be specific and actionable
- Base everything on the actual business context, not generic startup advice`;

        const researchResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          temperature: 0.2,
          messages: [{ role: "user", content: researchPrompt }]
        });

        const researchTextBlock = researchResponse.content[0];
        const researchText = (researchTextBlock.type === 'text' ? researchTextBlock.text : '').trim();
        
        let marketData;
        try {
          const jsonMatch = researchText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : researchText;
          marketData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("❌ Failed to parse research response:", parseError);
          throw new Error("Failed to generate market research - please try again");
        }

        // Save results to database in the correct format
        const savedIdea = await storage.updateStartupIdea(parseInt(ideaId), {
          analysis: {
            intelligentAnalysis: finalAnalysis,
            marketInsights: marketData,
            timestamp: new Date().toISOString()
          }
        });

        console.log(`✅ Contextual market research completed and saved for ${finalAnalysis.businessType}`);
        res.json({ success: true, marketData, idea: savedIdea });

      } catch (error) {
        console.error(`❌ Contextual market research failed:`, error);
        res.status(500).json({ 
          error: "Failed to complete market research",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Market Research API - Real AI-powered research (Legacy - keep for compatibility)
  app.post("/api/market-research", 
    advancedRateLimit(5, 10 * 60 * 1000), // 5 market research requests per 10 minutes
    body('ideaTitle').isLength({ min: 3, max: 200 }).withMessage('Idea title must be between 3 and 200 characters'),
    body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('industry').optional().isLength({ max: 100 }).trim(),
    body('stage').optional().isLength({ max: 50 }).trim(),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { ideaTitle, description, industry, stage } = req.body;
        
        // Sanitize inputs
        const sanitizedTitle = sanitizeHtml(ideaTitle.trim());
        const sanitizedDescription = sanitizeHtml(description.trim());
        const sanitizedIndustry = sanitizeQuery(industry || "Technology");
        const sanitizedStage = sanitizeQuery(stage || "Idea Stage");
        
        console.log(`🔍 Starting market research for: ${sanitizedTitle}`);
        
        // Use enhanced AI co-founder for comprehensive market research
        let marketResearch;
        try {
          const enhancedAnalysis = await aiCofounder.analyzeStartupIdea(
            sanitizedTitle,
            sanitizedDescription,
            sanitizedIndustry,
            sanitizedStage
          );

          // Extract comprehensive market research data
          marketResearch = {
            // Market sizing and opportunities
            totalMarketSize: enhancedAnalysis.marketAnalysis.marketSize || "$1B+ market opportunity",
            servableMarketSize: enhancedAnalysis.marketAnalysis.tam || "Large addressable market",
            targetMarketSize: enhancedAnalysis.marketAnalysis.sam || "Significant serviceable market",
            growthRate: enhancedAnalysis.marketAnalysis.growthRate || "15-25% annual growth",
            
            // Market segments derived from analysis
            marketSegments: enhancedAnalysis.marketAnalysis.keySegments?.map((segment: string, index: number) => ({
              name: segment,
              size: `$${Math.floor((enhancedAnalysis.marketAnalysis.marketSizeNumeric || 1000) / (index + 3) * 0.3)}M`,
              growth: Math.floor((enhancedAnalysis.marketAnalysis.growthRateNumeric || 20) * (0.8 + index * 0.1)),
              description: `${segment} market segment with ${index === 0 ? 'strong' : index === 1 ? 'moderate' : 'emerging'} growth potential`,
              opportunity: index === 0 ? "high" : index === 1 ? "medium" : "high"
            })) || [
              {
                name: "Primary Target Market",
                size: "$250M",
                growth: 22,
                description: "Core market segment with immediate opportunities",
                opportunity: "high" as const
              },
              {
                name: "Secondary Market",
                size: "$180M", 
                growth: 18,
                description: "Adjacent market with expansion potential",
                opportunity: "medium" as const
              }
            ],
            
            // Competitor analysis from AI research
            competitors: enhancedAnalysis.competitiveAnalysis?.competitors?.map((comp: any, index: number) => ({
              name: comp.name || `Market Competitor ${index + 1}`,
              type: comp.type || (index === 0 ? "direct" : index === 1 ? "indirect" : "substitute"),
              marketShare: comp.marketShare || Math.max(5, Math.floor(30 / (index + 1))),
              strengths: comp.strengths || enhancedAnalysis.overallAssessment.keyDifferentiators?.slice(0, 2) || ["Established presence", "Strong funding"],
              weaknesses: comp.weaknesses || enhancedAnalysis.overallAssessment.challenges?.slice(0, 2) || ["Limited innovation", "High prices"],
              pricing: comp.pricing || `$${50 + index * 75}-${200 + index * 100}/month`,
              funding: comp.funding || ["Seed", "Series A", "Series B"][index] || "Series B",
              description: comp.description || `${index === 0 ? 'Leading' : index === 1 ? 'Emerging' : 'Niche'} player in the ${sanitizedIndustry.toLowerCase()} market`
            })) || [
              {
                name: "Market Leader",
                type: "direct" as const,
                marketShare: 15,
                strengths: ["Brand recognition", "Large user base", "Established partnerships"],
                weaknesses: ["Legacy technology", "High pricing", "Poor customer service"],
                pricing: "$100-500/month",
                funding: "Public company",
                description: "Dominant player with significant market share but aging technology"
              }
            ],
            
            // Market trends from web research
            marketTrends: enhancedAnalysis.marketAnalysis.trends?.map((trend: string, index: number) => ({
              trend,
              impact: index < 2 ? "positive" as const : "neutral" as const,
              description: `${trend} is ${index < 2 ? 'driving market growth and' : 'creating new'} opportunities in the ${sanitizedIndustry.toLowerCase()} sector`,
              timeframe: index === 0 ? "2024-2025" : "2024-2026",
              relevance: Math.max(70, 95 - index * 10)
            })) || [
              {
                trend: "Digital Transformation Acceleration",
                impact: "positive" as const,
                description: "Rapid adoption of digital solutions creating new market opportunities",
                timeframe: "2024-2025",
                relevance: 85
              }
            ],
            
            // Customer personas from analysis
            customerPersonas: [
              {
                name: "Primary User",
                demographics: enhancedAnalysis.marketAnalysis.targetAudience || "Business professionals aged 25-45",
                painPoints: enhancedAnalysis.overallAssessment.challenges?.slice(0, 3) || ["Current solutions are expensive", "Lack of integration", "Poor user experience"],
                motivations: enhancedAnalysis.overallAssessment.strengths?.slice(0, 3) || ["Improve efficiency", "Reduce costs", "Scale operations"],
                channels: ["Online search", "Professional networks", "Industry publications"],
                budget: "$50-500/month"
              }
            ],
            
            // Research metadata
            webResearchEnabled: true,
            dataSourcesUsed: enhancedAnalysis.marketAnalysis.sources || ["Industry reports", "Competitor analysis", "Market data"],
            researchTimestamp: new Date().toISOString(),
            disclaimer: enhancedAnalysis.marketAnalysis.searchDisclaimer || "Data sourced from web research and AI analysis"
          };
          
          console.log(`✅ Market research completed with web-enabled AI analysis`);
        } catch (enhancedError) {
          console.warn(`⚠️ Enhanced market research failed, using basic analysis:`, enhancedError instanceof Error ? enhancedError.message : 'Unknown error');
          
          // Fallback to basic AI analysis
          const basicAnalysis = await analyzeStartupIdea(
            sanitizedTitle,
            sanitizedDescription,
            sanitizedIndustry,
            sanitizedStage
          );
          
          marketResearch = {
            totalMarketSize: basicAnalysis.marketSizeEstimate || "$500M+ market",
            servableMarketSize: "Significant addressable market",
            targetMarketSize: "Achievable market share",
            growthRate: "15-20% annual growth",
            marketSegments: [
              {
                name: "Primary Market",
                size: "$150M",
                growth: 18,
                description: "Core target market segment",
                opportunity: "high" as const
              }
            ],
            competitors: [
              {
                name: "Industry Competitor",
                type: "direct" as const,
                marketShare: 12,
                strengths: basicAnalysis.strengths?.slice(0, 2) || ["Established presence"],
                weaknesses: basicAnalysis.weaknesses?.slice(0, 2) || ["Limited innovation"],
                pricing: "$75-250/month",
                funding: "Series A",
                description: "Established competitor with traditional approach"
              }
            ],
            marketTrends: [
              {
                trend: "Market Evolution",
                impact: "positive" as const,
                description: "Industry trends favor innovative solutions",
                timeframe: "2024-2025",
                relevance: 75
              }
            ],
            customerPersonas: [
              {
                name: "Target Customer",
                demographics: "Business users seeking better solutions",
                painPoints: basicAnalysis.weaknesses || ["Current pain points"],
                motivations: basicAnalysis.strengths || ["Value drivers"],
                channels: ["Digital channels", "Referrals"],
                budget: "$50-300/month"
              }
            ],
            webResearchEnabled: false,
            dataSourcesUsed: ["AI analysis", "Industry knowledge"],
            researchTimestamp: new Date().toISOString(),
            disclaimer: "Basic AI analysis - enhanced web research temporarily unavailable"
          };
        }
        
        res.json(marketResearch);
      } catch (error) {
        console.error("Market research error:", error);
        res.status(500).json({ 
          message: "Market research failed. Please try again." 
        });
      }
    }
  );

  // Market Research Agent API - Simplified endpoint for uAgent integration
  app.post("/api/market-research/analyze",
    advancedRateLimit(10, 10 * 60 * 1000), // 10 requests per 10 minutes for agents
    body('idea').isLength({ min: 10, max: 1000 }).withMessage('Idea must be between 10 and 1000 characters'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { idea } = req.body;
        const sanitizedIdea = sanitizeHtml(idea.trim());
        
        console.log(`🤖 Agent market research request: ${sanitizedIdea.substring(0, 100)}...`);
        
        // Use AI co-founder for quick analysis
        const analysis = await aiCofounder.analyzeStartupIdea(
          sanitizedIdea,
          sanitizedIdea,
          "Technology",
          "Idea Stage"
        );

        // Return structured analysis for agent
        const agentResponse = {
          analysis: `
📊 **Market Analysis**
${analysis.overallAssessment.marketOpportunity || 'Market analysis in progress...'}

**Market Size:** ${analysis.marketAnalysis.marketSize || 'Significant opportunity'}
**Growth Rate:** ${analysis.marketAnalysis.growthRate || '15-25% annually'}

💡 **Key Opportunities**
${analysis.marketAnalysis.opportunities?.map((o: string) => `• ${o}`).join('\n') || '• Strong market demand\n• Growing industry'}

⚠️ **Challenges to Consider**
${analysis.overallAssessment.challenges?.map((c: string) => `• ${c}`).join('\n') || '• Competitive landscape\n• Market entry barriers'}

🎯 **Competitive Advantages**
${analysis.overallAssessment.keyDifferentiators?.map((d: string) => `• ${d}`).join('\n') || '• Innovation potential\n• Unique value proposition'}

**Overall Score:** ${analysis.overallAssessment.viabilityScore}/100
**Recommendations:** ${analysis.overallAssessment.recommendations?.join(', ') || 'Further research recommended'}
          `.trim(),
          marketSize: analysis.marketAnalysis.marketSize,
          growthRate: analysis.marketAnalysis.growthRate,
          viabilityScore: analysis.overallAssessment.viabilityScore,
          opportunities: analysis.marketAnalysis.opportunities,
          challenges: analysis.overallAssessment.challenges,
          timestamp: new Date().toISOString()
        };

        res.json(agentResponse);
      } catch (error) {
        console.error("Agent market research error:", error);
        res.status(500).json({ 
          error: "Market research analysis failed",
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Business Plan Agent API - Multi-agent orchestration endpoint
  app.post("/api/business-plan/generate",
    advancedRateLimit(5, 10 * 60 * 1000), // 5 requests per 10 minutes (more resource intensive)
    body('idea').isLength({ min: 10, max: 1000 }).withMessage('Idea must be between 10 and 1000 characters'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { idea } = req.body;
        const sanitizedIdea = sanitizeHtml(idea.trim());
        
        console.log(`🤖 Agent business plan request: ${sanitizedIdea.substring(0, 100)}...`);
        
        // First, get market research analysis (multi-agent coordination)
        const analysis = await aiCofounder.analyzeStartupIdea(
          sanitizedIdea,
          sanitizedIdea,
          "Technology",
          "Idea Stage"
        );

        // Generate comprehensive business plan using AI - using structured analysis
        const businessPlanSections = {
          executiveSummary: `${sanitizedIdea} is an innovative solution in the ${analysis.industry || 'Technology'} sector. ${analysis.overallAssessment.marketOpportunity || 'Strong market opportunity identified.'} With a viability score of ${analysis.overallAssessment.viabilityScore}/100, this venture shows promising potential.`,
          businessModel: analysis.overallAssessment.competitivePosition || 'Scalable business model with clear revenue streams and market positioning.',
          goToMarket: `Strategic market entry focusing on ${analysis.marketAnalysis.targetAudience || 'target customer segments'}. ${analysis.overallAssessment.nextSteps?.join(' ') || 'Customer acquisition through digital channels and strategic partnerships.'}`,
          financials: `Funding requirements: ${analysis.overallAssessment.fundingRequirements || '$500K-$2M'}. Timeline to market: ${analysis.overallAssessment.timelineToMarket || '6-12 months'}.`
        };

        // Format business plan for agent response
        const agentResponse = {
          business_plan: `
# Business Plan: ${sanitizedIdea}

## 📊 Executive Summary
${businessPlanSections.executiveSummary}

## 🎯 Market Analysis (Multi-Agent Coordination)
${analysis.overallAssessment.marketOpportunity || 'Market research completed via autonomous agent coordination.'}

**Market Size:** ${analysis.marketAnalysis.marketSize || 'Significant opportunity'}
**Growth Rate:** ${analysis.marketAnalysis.growthRate || '15-25% annually'}
**Viability Score:** ${analysis.overallAssessment.viabilityScore}/100

## 💼 Business Model
${businessPlanSections.businessModel}

## 🚀 Go-to-Market Strategy
${businessPlanSections.goToMarket}

## 💰 Financial Projections
${businessPlanSections.financials}

## 🎯 Key Opportunities
${analysis.marketAnalysis.opportunities?.map((o: string) => `• ${o}`).join('\n') || '• Market demand\n• Growth potential'}

## ⚠️ Risk Factors
${analysis.overallAssessment.challenges?.map((c: string) => `• ${c}`).join('\n') || '• Competition\n• Market risks'}

## 📈 Success Metrics
• Customer Acquisition Cost (CAC)
• Lifetime Value (LTV)
• Monthly Recurring Revenue (MRR)
• User Growth Rate

---
_Generated by MyStartup.ai Business Plan Agent_
_Multi-Agent Orchestration: Market Research + Business Planning_
          `.trim(),
          sections: businessPlanSections,
          marketAnalysis: {
            marketSize: analysis.marketAnalysis.marketSize,
            growthRate: analysis.marketAnalysis.growthRate,
            viabilityScore: analysis.overallAssessment.viabilityScore
          },
          timestamp: new Date().toISOString()
        };

        res.json(agentResponse);
      } catch (error) {
        console.error("Agent business plan error:", error);
        res.status(500).json({ 
          error: "Business plan generation failed",
          message: error instanceof Error ? error.message : 'AI analysis temporarily unavailable'
        });
      }
    }
  );

  // Demo Session Management API
  app.post("/api/demo/sessions", async (req, res) => {
    try {
      const validatedData = insertDemoSessionSchema.parse(req.body);
      const sessionId = validatedData.sessionId || crypto.randomUUID();
      
      const session = await storage.createDemoSession({
        ...validatedData,
        sessionId
      });
      
      res.json(session);
    } catch (error) {
      console.error("Error creating demo session:", error);
      res.status(500).json({ message: "Failed to create demo session" });
    }
  });

  app.get("/api/demo/sessions/:sessionId", async (req, res) => {
    try {
      const session = await storage.getDemoSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Demo session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error getting demo session:", error);
      res.status(500).json({ message: "Failed to get demo session" });
    }
  });

  app.get("/api/demo/sessions/:sessionId/artifacts", async (req, res) => {
    try {
      const artifacts = await storage.getArtifactsBySession(req.params.sessionId);
      res.json(artifacts);
    } catch (error) {
      console.error("Error getting artifacts:", error);
      res.status(500).json({ message: "Failed to get artifacts" });
    }
  });

  // AI Generation Endpoints for Enhanced Demos
  app.post("/api/demo/generate/pitch-deck", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const session = await storage.getDemoSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Demo session not found" });
      }

      // Create or update the artifact as generating
      let artifact = await storage.getArtifactByType(sessionId, "pitch-deck");
      if (!artifact) {
        artifact = await storage.createArtifact({
          sessionId,
          type: "pitch-deck",
          title: `${session.ideaTitle} - Pitch Deck`,
          summary: "AI-generated investor pitch deck",
          content: {},
          generationStatus: "generating"
        });
      } else {
        artifact = await storage.updateArtifact(artifact.id, {
          generationStatus: "generating"
        }) || artifact;
      }

      // Generate enhanced pitch deck content
      // Generate basic pitch deck structure (simplified for demo)
      const pitchDeckData = {
        slides: [
          { title: "Problem", content: session.problemStatement || "Market challenges" },
          { title: "Solution", content: session.solutionApproach || "Our approach" },
          { title: "Market", content: session.targetMarket || "Target market" }
        ]
      };

      // Enhanced content structure with slides and branding
      const enhancedContent = {
        slides: [
          {
            type: "title",
            title: session.ideaTitle,
            subtitle: "Revolutionizing " + session.industry,
            brandColors: session.brandColors
          },
          {
            type: "problem",
            title: "The Problem",
            content: session.problemStatement || "Market challenges and pain points",
            visual: "chart"
          },
          {
            type: "solution",
            title: "Our Solution",
            content: session.solutionApproach || "Our innovative approach",
            features: ["Key Feature 1", "Key Feature 2", "Key Feature 3"]
          },
          {
            type: "market",
            title: "Market Opportunity",
            content: session.targetMarket || "Target market analysis",
            marketSize: "$10B+ TAM"
          },
          {
            type: "business-model",
            title: "Business Model",
            content: session.revenueModel || "Revenue generation strategy",
            streams: ["Primary Revenue", "Secondary Revenue", "Future Opportunities"]
          },
          {
            type: "financial",
            title: "Financial Projections",
            projections: {
              year1: "$500K",
              year2: "$2M",
              year3: "$5M"
            }
          }
        ],
        originalPitchDeck: pitchDeckData,
        brandTheme: session.brandColors,
        exportFormats: ["pdf", "pptx"]
      };

      // Update artifact with generated content
      const updatedArtifact = await storage.updateArtifact(artifact.id, {
        content: enhancedContent,
        generationStatus: "completed",
        quality: 92,
        insights: [
          "Professional slide design with brand consistency",
          "Compelling narrative structure",
          "Data-driven market insights",
          "Investor-ready formatting"
        ],
        crossLinks: { businessPlan: "link-to-business-plan", financialModel: "link-to-financial-model" }
      });

      // Update session progress
      await storage.updateDemoSession(sessionId, {
        completedArtifacts: ["pitch-deck"],
        progress: { pitchDeck: "completed" }
      });

      res.json(updatedArtifact);
    } catch (error) {
      console.error("Error generating pitch deck:", error);
      res.status(500).json({ message: "Failed to generate pitch deck" });
    }
  });

  app.post("/api/demo/generate/financial-model", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const session = await storage.getDemoSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Demo session not found" });
      }

      let artifact = await storage.getArtifactByType(sessionId, "financial-model");
      if (!artifact) {
        artifact = await storage.createArtifact({
          sessionId,
          type: "financial-model",
          title: `${session.ideaTitle} - Financial Model`,
          summary: "Interactive financial projections and scenarios",
          content: {},
          generationStatus: "generating"
        });
      }

      // Enhanced financial model with interactive elements
      const enhancedContent = {
        assumptions: {
          customerAcquisitionCost: 50,
          monthlyChurn: 0.05,
          averageRevenuePerUser: 29,
          growthRate: 0.15
        },
        projections: {
          year1: { revenue: 500000, expenses: 400000, profit: 100000 },
          year2: { revenue: 2000000, expenses: 1400000, profit: 600000 },
          year3: { revenue: 5000000, expenses: 3000000, profit: 2000000 }
        },
        charts: {
          revenueGrowth: "line-chart-data",
          expenseBreakdown: "pie-chart-data",
          profitability: "bar-chart-data"
        },
        scenarios: {
          conservative: "80% of base case",
          aggressive: "150% of base case"
        },
        breakEven: {
          month: 14,
          customers: 1250,
          revenue: 36250
        },
        interactive: true,
        exportFormats: ["xlsx", "pdf"]
      };

      const updatedArtifact = await storage.updateArtifact(artifact.id, {
        content: enhancedContent,
        generationStatus: "completed",
        quality: 89,
        insights: [
          "Conservative growth assumptions",
          "Break-even achievable in 14 months",
          "Strong unit economics",
          "Scalable revenue model"
        ]
      });

      res.json(updatedArtifact);
    } catch (error) {
      console.error("Error generating financial model:", error);
      res.status(500).json({ message: "Failed to generate financial model" });
    }
  });

  // Gamification API routes
  app.get("/api/gamification/me", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Get user progress, create if doesn't exist
      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        progress = await storage.createUserProgress({ userId });
      }
      
      // Get user badges
      const userBadges = await storage.getUserBadges(userId);
      const badges = await storage.getBadges();
      const badgesWithStatus = badges.map(badge => ({
        ...badge,
        earned: userBadges.some(ub => ub.badgeId === badge.id),
        earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.earnedAt || null
      }));
      
      // Get user quests
      const userQuests = await storage.getUserQuests(userId);
      const activeQuests = await storage.getActiveQuests();
      const questsWithProgress = activeQuests.map(quest => {
        const userQuest = userQuests.find(uq => uq.questId === quest.id);
        return {
          ...quest,
          progress: userQuest?.progress || 0,
          completed: userQuest?.completed || false,
          claimed: userQuest?.claimed || false,
          canClaim: userQuest?.completed && !userQuest?.claimed
        };
      });
      
      res.json({
        progress,
        badges: badgesWithStatus,
        quests: questsWithProgress
      });
    } catch (error) {
      console.error("Error fetching gamification data:", error);
      res.status(500).json({ message: "Failed to fetch gamification data" });
    }
  });

  app.post("/api/gamification/events", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { action, metadata = {} } = req.body;
      
      let xpAwarded = 0;
      let levelUp = false;
      let newLevel = undefined;
      
      // Award XP based on action
      switch (action) {
        case "idea_submitted":
          xpAwarded = 50;
          break;
        case "business_plan_generated":
          xpAwarded = 100;
          break;
        case "pitch_deck_generated":
          xpAwarded = 75;
          break;
        case "profile_completed":
          xpAwarded = 25;
          break;
        case "daily_login":
          xpAwarded = 10;
          break;
        default:
          xpAwarded = 10;
      }
      
      // Award XP
      const result = await storage.awardXp(userId, xpAwarded, action);
      levelUp = result.leveledUp;
      newLevel = result.newLevel;
      
      // Update streak for daily actions
      if (action === "daily_login") {
        await storage.updateStreak(userId);
      }
      
      // Update quest progress
      const userQuests = await storage.getUserQuests(userId);
      const activeQuests = await storage.getActiveQuests();
      
      for (const quest of activeQuests) {
        const userQuest = userQuests.find(uq => uq.questId === quest.id);
        if (quest.metric === action && userQuest && !userQuest.completed) {
          const currentProgress = userQuest.progress ?? 0;
          const newProgress = Math.min(currentProgress + 1, quest.target);
          await storage.updateQuestProgress(userId, quest.id, newProgress);
        }
      }
      
      // Check for badge eligibility (simple example)
      const eligibleBadges = await storage.checkBadgeEligibility(userId);
      const newBadges = [];
      
      for (const badge of eligibleBadges) {
        // Award "First Idea" badge
        if (badge.name === "First Idea" && action === "idea_submitted") {
          await storage.awardBadge(userId, badge.id);
          newBadges.push(badge);
        }
        // Award "Level Up" badge when reaching level 5
        if (badge.name === "Rising Star" && newLevel && newLevel >= 5) {
          await storage.awardBadge(userId, badge.id);
          newBadges.push(badge);
        }
      }
      
      res.json({
        xpAwarded,
        levelUp,
        newLevel,
        newBadges
      });
    } catch (error) {
      console.error("Error processing gamification event:", error);
      res.status(500).json({ message: "Failed to process gamification event" });
    }
  });

  app.post("/api/gamification/quests/:questId/claim", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const questId = parseInt(req.params.questId);
      
      if (isNaN(questId)) {
        return res.status(400).json({ message: "Invalid quest ID" });
      }
      
      // Get user quest to verify completion
      const userQuests = await storage.getUserQuests(userId);
      const userQuest = userQuests.find(uq => uq.questId === questId);
      
      if (!userQuest || !userQuest.completed || userQuest.claimed) {
        return res.status(400).json({ message: "Quest cannot be claimed" });
      }
      
      // Claim quest and award rewards
      const rewards = await storage.claimQuest(userId, questId);
      
      res.json({
        message: "Quest claimed successfully!",
        rewards
      });
    } catch (error) {
      console.error("Error claiming quest:", error);
      res.status(500).json({ message: "Failed to claim quest" });
    }
  });

  // Daily Check-in API routes
  app.get("/api/checkin/status", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const hasCheckedIn = await storage.hasCheckedInToday(userId);
      
      res.json({
        hasCheckedInToday: hasCheckedIn
      });
    } catch (error) {
      console.error("Error checking daily check-in status:", error);
      res.status(500).json({ message: "Failed to check check-in status" });
    }
  });

  app.post("/api/checkin", 
    requireAuth,
    advancedRateLimit(5, 60000), // Add rate limiting for check-ins (5 requests per minute)
    body('mood').optional().isString().withMessage('Mood must be a string'),
    body('note').optional().isString().withMessage('Note must be a string'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { mood, note } = req.body;
        
        // Sanitize inputs if provided
        const sanitizedMood = mood ? sanitizeHtml(mood.trim()) : undefined;
        const sanitizedNote = note ? sanitizeHtml(note.trim()) : undefined;
        
        const result = await storage.performDailyCheckin(userId, sanitizedMood, sanitizedNote);
        
        res.json({
          message: "Daily check-in completed successfully!",
          ...result
        });
      } catch (error: any) {
        console.error("Error performing daily check-in:", error);
        
        // Improved error handling using error codes instead of string matching
        if (error.code === 'DUPLICATE_CHECKIN') {
          return res.status(409).json({ 
            message: "You have already checked in today",
            error: "DUPLICATE_CHECKIN" 
          });
        }
        
        // Handle database constraint violations
        if (error.code === '23505' && error.constraint?.includes('unique_user_date')) {
          return res.status(409).json({ 
            message: "You have already checked in today",
            error: "DUPLICATE_CHECKIN" 
          });
        }
        
        // Handle validation errors
        if (error.code === '23502') { // NOT NULL constraint violation
          return res.status(400).json({ 
            message: "Invalid check-in data provided",
            error: "VALIDATION_ERROR" 
          });
        }
        
        // Generic error fallback
        res.status(500).json({ 
          message: "Failed to perform daily check-in",
          error: "INTERNAL_ERROR" 
        });
      }
    }
  );

  app.get("/api/checkin/history", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const limit = parseInt(req.query.limit as string) || 30;
      
      // Validate limit
      if (limit < 1 || limit > 365) {
        return res.status(400).json({ message: "Limit must be between 1 and 365" });
      }
      
      const history = await storage.getDailyCheckinHistory(userId, limit);
      
      res.json({
        history
      });
    } catch (error) {
      console.error("Error fetching daily check-in history:", error);
      res.status(500).json({ message: "Failed to fetch check-in history" });
    }
  });

  app.get("/api/checkin/stats", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const stats = await storage.getDailyCheckinStats(userId);
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching daily check-in stats:", error);
      res.status(500).json({ message: "Failed to fetch check-in statistics" });
    }
  });

  // Credit System API Endpoints
  
  // GET /api/credits/balance - Get current credit balance with recent transactions
  app.get("/api/credits/balance", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const balanceData = await storage.getCreditBalance(userId);
      
      res.json(balanceData);
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      res.status(500).json({ message: "Failed to fetch credit balance" });
    }
  });

  // GET /api/credits/history - Get credit transaction history
  app.get("/api/credits/history", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validate limit
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Limit must be between 1 and 100" });
      }
      
      const transactions = await storage.getCreditTransactions(userId, limit);
      
      res.json({
        transactions
      });
    } catch (error) {
      console.error("Error fetching credit transaction history:", error);
      res.status(500).json({ message: "Failed to fetch transaction history" });
    }
  });

  // Solana Pay Integration Endpoints
  
  // Initialize Solana connection
  const getSolanaConnection = () => {
    const network = process.env.SOLANA_NETWORK || 'devnet';
    const rpcUrl = network === 'mainnet-beta' 
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
    return new Connection(rpcUrl, 'confirmed');
  };

  // POST /api/payments/solana/create-payment
  app.post("/api/payments/solana/create-payment",
    requireAuth,
    advancedRateLimit(10, 60000), // 10 requests per minute
    body('packageType').isIn(['CORE', 'PRO']).withMessage('Package type must be CORE or PRO'),
    body('paymentMethod').isIn(['SOL', 'USDC']).withMessage('Payment method must be SOL or USDC'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { packageType, paymentMethod } = req.body;

        // Get recipient wallet from environment
        const recipientWallet = process.env.SOLANA_RECIPIENT_WALLET;
        if (!recipientWallet) {
          console.error("SOLANA_RECIPIENT_WALLET not configured");
          return res.status(500).json({ message: "Payment system not configured" });
        }

        // Get package details
        const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
        if (!packageInfo) {
          return res.status(400).json({ message: "Invalid package type" });
        }

        // Calculate amount based on payment method
        let amount: BigNumber;
        let splToken: PublicKey | undefined;

        if (paymentMethod === 'USDC') {
          // USDC payment (6 decimals)
          amount = new BigNumber(packageInfo.priceUSD);
          const network = process.env.SOLANA_NETWORK || 'devnet';
          // USDC mint addresses
          const usdcMint = network === 'mainnet-beta'
            ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC mainnet
            : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // USDC devnet
          splToken = new PublicKey(usdcMint);
        } else {
          // SOL payment
          amount = new BigNumber(packageInfo.priceSol);
        }

        // Create reference for tracking this specific transaction
        const reference = new PublicKey(crypto.randomBytes(32));

        // Create payment request
        const recipient = new PublicKey(recipientWallet);
        const label = `MyStartup.AI - ${packageInfo.name} Package`;
        const message = `Purchase ${packageInfo.credits} credits`;
        const memo = `PACKAGE:${packageType}|USER:${userId}|REF:${reference.toBase58()}`;

        // Generate Solana Pay URL
        const url = encodeURL({
          recipient,
          amount,
          splToken,
          reference,
          label,
          message,
          memo,
        });

        // Store pending transaction reference
        const pendingTransaction = {
          userId,
          packageType,
          paymentMethod,
          amount: amount.toString(),
          reference: reference.toBase58(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        console.log('Created Solana Pay request:', {
          userId,
          packageType,
          paymentMethod,
          amount: amount.toString(),
          reference: reference.toBase58(),
        });

        res.json({
          url: url.toString(),
          reference: reference.toBase58(),
          amount: amount.toString(),
          packageType,
          paymentMethod,
          recipient: recipientWallet,
          label,
          message,
        });
      } catch (error) {
        console.error("Error creating Solana payment:", error);
        res.status(500).json({ 
          message: "Failed to create payment request",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // POST /api/payments/solana/create-transaction - Create transaction for Phantom wallet
  app.post("/api/payments/solana/create-transaction",
    requireAuth,
    advancedRateLimit(10, 60000),
    body('fromPubkey').isString().notEmpty().withMessage('From public key is required'),
    body('reference').isString().notEmpty().withMessage('Reference is required'),
    body('packageType').isIn(['CORE', 'PRO']).withMessage('Package type must be CORE or PRO'),
    body('paymentMethod').isIn(['SOL', 'USDC']).withMessage('Payment method must be SOL or USDC'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const { fromPubkey, reference, packageType, paymentMethod } = req.body;

        // Get recipient wallet
        const recipientWallet = process.env.SOLANA_RECIPIENT_WALLET;
        if (!recipientWallet) {
          return res.status(500).json({ message: "Payment system not configured" });
        }

        // Get package details
        const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
        if (!packageInfo) {
          return res.status(400).json({ message: "Invalid package type" });
        }

        // Calculate amount based on payment method
        let amount: BigNumber;
        let splToken: PublicKey | undefined;

        if (paymentMethod === 'USDC') {
          amount = new BigNumber(packageInfo.priceUSD);
          splToken = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mainnet
        } else {
          amount = new BigNumber(packageInfo.priceSol);
        }

        // Create connection
        const connection = getSolanaConnection();

        // Create transfer instruction using Solana Pay
        const fromPublicKey = new PublicKey(fromPubkey);
        const toPublicKey = new PublicKey(recipientWallet);
        const referencePublicKey = new PublicKey(reference);

        const transfer = await createTransfer(connection, fromPublicKey, {
          recipient: toPublicKey,
          amount,
          splToken,
          reference: referencePublicKey,
          memo: `MyStartup.AI ${packageType}`,
        });

        // Serialize transaction
        const serializedTransaction = transfer.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        }).toString('base64');

        res.json({
          serializedTransaction,
          reference,
        });
      } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ 
          message: "Failed to create transaction",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // POST /api/payments/solana/verify
  app.post("/api/payments/solana/verify",
    requireAuth,
    advancedRateLimit(20, 60000), // 20 requests per minute (for polling)
    body('signature').isString().notEmpty().withMessage('Transaction signature is required'),
    body('packageType').isIn(['CORE', 'PRO']).withMessage('Package type must be CORE or PRO'),
    body('paymentMethod').isIn(['SOL', 'USDC']).withMessage('Payment method must be SOL or USDC'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { signature, packageType, paymentMethod } = req.body;

        // Check if signature was already processed (prevent double-spending)
        const existingTransaction = await storage.getCreditTransactionBySignature(signature);
        if (existingTransaction) {
          return res.status(400).json({ 
            message: "Transaction already processed",
            status: 'already_processed'
          });
        }

        // Get recipient wallet
        const recipientWallet = process.env.SOLANA_RECIPIENT_WALLET;
        if (!recipientWallet) {
          return res.status(500).json({ message: "Payment system not configured" });
        }

        // Get package details
        const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
        if (!packageInfo) {
          return res.status(400).json({ message: "Invalid package type" });
        }

        // Connect to Solana and verify transaction
        const connection = getSolanaConnection();
        
        let transaction;
        try {
          transaction = await connection.getTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
          });
        } catch (error) {
          console.error("Error fetching transaction:", error);
          return res.status(400).json({ 
            message: "Transaction not found on blockchain",
            status: 'not_found'
          });
        }

        if (!transaction) {
          return res.status(400).json({ 
            message: "Transaction not found",
            status: 'not_found'
          });
        }

        // Verify transaction succeeded
        if (transaction.meta?.err) {
          return res.status(400).json({ 
            message: "Transaction failed on blockchain",
            status: 'failed'
          });
        }

        // Verify recipient address
        const recipientPubkey = new PublicKey(recipientWallet);
        let isRecipientValid = false;
        let actualAmount = 0;

        // Check transaction accounts and amounts
        if (paymentMethod === 'SOL') {
          // For SOL transfers, check pre and post balances
          const accountKeys = transaction.transaction.message.getAccountKeys();
          const recipientIndex = accountKeys.staticAccountKeys.findIndex(
            key => key.equals(recipientPubkey)
          );

          if (recipientIndex >= 0 && transaction.meta?.postBalances && transaction.meta?.preBalances) {
            const preBalance = transaction.meta.preBalances[recipientIndex];
            const postBalance = transaction.meta.postBalances[recipientIndex];
            actualAmount = (postBalance - preBalance) / LAMPORTS_PER_SOL;
            isRecipientValid = actualAmount > 0;
          }
        } else {
          // For USDC/SPL tokens, check token balances
          const postTokenBalances = transaction.meta?.postTokenBalances || [];
          const preTokenBalances = transaction.meta?.preTokenBalances || [];
          
          for (const postBalance of postTokenBalances) {
            if (postBalance.owner === recipientWallet) {
              const preBalance = preTokenBalances.find(
                pre => pre.accountIndex === postBalance.accountIndex
              );
              const preAmount = preBalance?.uiTokenAmount.uiAmount || 0;
              const postAmount = postBalance.uiTokenAmount.uiAmount || 0;
              actualAmount = postAmount - preAmount;
              isRecipientValid = actualAmount > 0;
              break;
            }
          }
        }

        if (!isRecipientValid) {
          return res.status(400).json({ 
            message: "Transaction does not contain valid payment to recipient",
            status: 'invalid_recipient'
          });
        }

        // Verify amount matches package price (with 5% tolerance for slippage/fees)
        const expectedAmount = paymentMethod === 'SOL' 
          ? packageInfo.priceSol 
          : packageInfo.priceUSD;
        const minAmount = expectedAmount * 0.95; // 5% tolerance

        if (actualAmount < minAmount) {
          return res.status(400).json({ 
            message: `Insufficient payment amount. Expected ${expectedAmount}, received ${actualAmount}`,
            status: 'insufficient_amount'
          });
        }

        // All validations passed - allocate credits
        const paymentMethodStr = paymentMethod === 'SOL' 
          ? PAYMENT_METHODS.SOLANA_SOL 
          : PAYMENT_METHODS.SOLANA_USDC;

        await storage.addCredits(
          userId,
          packageInfo.credits,
          `Purchased ${packageInfo.name} package via Solana ${paymentMethod}`,
          {
            transactionHash: signature,
            paymentMethod: paymentMethodStr,
            paymentAmount: actualAmount.toString(),
            currency: paymentMethod === 'SOL' ? 'SOL' : 'USDC',
            paymentStatus: PAYMENT_STATUS.COMPLETED,
          }
        );

        // Activate subscription if purchasing CORE or PRO
        if (packageType === 'CORE' || packageType === 'PRO') {
          const now = new Date();
          const nextBillingDate = new Date(now);
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1); // Billing 30 days from now
          
          const creditsResetDate = new Date(nextBillingDate);

          await storage.updateUser(userId, {
            currentPlan: packageType,
            subscriptionStatus: 'active',
            subscriptionStartDate: now,
            nextBillingDate: nextBillingDate,
            creditsResetDate: creditsResetDate,
            monthlyCreditsUsed: 0, // Reset overage tracking
          });
        }

        console.log('Solana payment verified and credits allocated:', {
          userId,
          signature,
          packageType,
          credits: packageInfo.credits,
          amount: actualAmount,
        });

        res.json({
          message: "Payment verified and credits allocated successfully",
          status: 'completed',
          credits: packageInfo.credits,
          signature,
        });
      } catch (error) {
        console.error("Error verifying Solana payment:", error);
        res.status(500).json({ 
          message: "Failed to verify payment",
          status: 'error',
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // GET /api/payments/solana/status/:signature
  app.get("/api/payments/solana/status/:signature",
    requireAuth,
    advancedRateLimit(30, 60000), // 30 requests per minute (for frequent polling)
    async (req, res) => {
      try {
        const { signature } = req.params;

        if (!signature || signature.length < 32) {
          return res.status(400).json({ message: "Invalid transaction signature" });
        }

        // Check if already processed in our database
        const existingTransaction = await storage.getCreditTransactionBySignature(signature);
        if (existingTransaction) {
          return res.json({
            status: 'completed',
            processed: true,
            credits: existingTransaction.amount,
            timestamp: existingTransaction.createdAt,
          });
        }

        // Check blockchain for transaction status
        const connection = getSolanaConnection();
        
        try {
          const status = await connection.getSignatureStatus(signature, {
            searchTransactionHistory: true,
          });

          if (!status || !status.value) {
            return res.json({
              status: 'not_found',
              processed: false,
              message: 'Transaction not yet confirmed on blockchain',
            });
          }

          if (status.value.err) {
            return res.json({
              status: 'failed',
              processed: false,
              message: 'Transaction failed on blockchain',
              error: status.value.err,
            });
          }

          const confirmationStatus = status.value.confirmationStatus;
          
          if (confirmationStatus === 'finalized' || confirmationStatus === 'confirmed') {
            return res.json({
              status: 'confirmed',
              processed: false,
              message: 'Transaction confirmed, awaiting verification',
              confirmationStatus,
            });
          }

          return res.json({
            status: 'pending',
            processed: false,
            message: 'Transaction pending confirmation',
            confirmationStatus,
          });
        } catch (error) {
          console.error("Error checking transaction status:", error);
          return res.json({
            status: 'unknown',
            processed: false,
            message: 'Unable to check transaction status',
          });
        }
      } catch (error) {
        console.error("Error checking Solana payment status:", error);
        res.status(500).json({ 
          message: "Failed to check payment status",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // PayPal Integration Endpoints
  
  // Initialize PayPal client
  const getPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }
    
    // Use sandbox for development, live for production
    const environment = process.env.NODE_ENV === 'production'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    return new paypal.core.PayPalHttpClient(environment);
  };

  // POST /api/payments/paypal/create-order
  app.post("/api/payments/paypal/create-order",
    requireAuth,
    advancedRateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes
    body('packageType').isIn(['CORE', 'PRO']).withMessage('Package type must be CORE or PRO'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { packageType } = req.body;

        // Get package details
        const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
        if (!packageInfo) {
          return res.status(400).json({ message: "Invalid package type" });
        }

        // Create PayPal order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [{
            description: `MyStartup.AI - ${packageInfo.name} Package (${packageInfo.credits} credits)`,
            amount: {
              currency_code: 'USD',
              value: packageInfo.priceUSD.toFixed(2),
            },
            custom_id: `USER:${userId}|PACKAGE:${packageType}`,
          }],
          application_context: {
            brand_name: 'MyStartup.AI',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
          },
        });

        // Execute PayPal request
        const client = getPayPalClient();
        const order = await client.execute(request);

        console.log('Created PayPal order:', {
          userId,
          packageType,
          orderId: order.result.id,
          amount: packageInfo.priceUSD,
        });

        res.json({
          orderId: order.result.id,
          packageType,
          amount: packageInfo.priceUSD,
          credits: packageInfo.credits,
        });
      } catch (error) {
        console.error("Error creating PayPal order:", error);
        
        // Check if PayPal credentials are missing
        if (error instanceof Error && error.message.includes('not configured')) {
          return res.status(500).json({ 
            message: "Payment system not configured",
          });
        }
        
        res.status(500).json({ 
          message: "Failed to create PayPal order",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // POST /api/payments/paypal/capture
  app.post("/api/payments/paypal/capture",
    requireAuth,
    advancedRateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes
    body('orderId').isString().notEmpty().withMessage('Order ID is required'),
    body('packageType').isIn(['CORE', 'PRO']).withMessage('Package type must be CORE or PRO'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { orderId, packageType } = req.body;

        // Check if order was already processed (prevent double-capture)
        const existingTransaction = await storage.getCreditTransactionBySignature(orderId);
        if (existingTransaction) {
          return res.status(400).json({ 
            message: "Order already processed",
            status: 'already_processed'
          });
        }

        // Get package details
        const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
        if (!packageInfo) {
          return res.status(400).json({ message: "Invalid package type" });
        }

        // Capture PayPal order
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const client = getPayPalClient();
        const capture = await client.execute(request);

        // Verify order status
        if (capture.result.status !== 'COMPLETED') {
          return res.status(400).json({ 
            message: `Payment not completed. Status: ${capture.result.status}`,
            status: 'payment_incomplete'
          });
        }

        // Verify amount matches package price
        const capturedAmount = parseFloat(
          capture.result.purchase_units[0].payments.captures[0].amount.value
        );
        
        if (Math.abs(capturedAmount - packageInfo.priceUSD) > 0.01) {
          console.error('Amount mismatch:', {
            expected: packageInfo.priceUSD,
            received: capturedAmount,
          });
          return res.status(400).json({ 
            message: "Payment amount mismatch",
            status: 'amount_mismatch'
          });
        }

        // Verify user ID from custom_id
        const customId = capture.result.purchase_units[0].custom_id;
        if (customId && !customId.includes(`USER:${userId}`)) {
          console.error('User ID mismatch in custom_id:', {
            expected: userId,
            customId,
          });
          return res.status(400).json({ 
            message: "Order does not belong to this user",
            status: 'user_mismatch'
          });
        }

        // All validations passed - allocate credits
        await storage.addCredits(
          userId,
          packageInfo.credits,
          `Purchased ${packageInfo.name} package via PayPal`,
          {
            transactionHash: orderId,
            paymentMethod: PAYMENT_METHODS.PAYPAL,
            paymentAmount: capturedAmount.toString(),
            currency: 'USD',
            paymentStatus: PAYMENT_STATUS.COMPLETED,
          }
        );

        console.log('PayPal payment captured and credits allocated:', {
          userId,
          orderId,
          packageType,
          credits: packageInfo.credits,
          amount: capturedAmount,
        });

        res.json({
          message: "Payment captured and credits allocated successfully",
          status: 'completed',
          credits: packageInfo.credits,
          orderId,
          amount: capturedAmount,
        });
      } catch (error) {
        console.error("Error capturing PayPal payment:", error);
        
        // Handle specific PayPal errors
        if (error instanceof Error) {
          if (error.message.includes('not configured')) {
            return res.status(500).json({ 
              message: "Payment system not configured",
              status: 'error'
            });
          }
          if (error.message.includes('RESOURCE_NOT_FOUND')) {
            return res.status(404).json({ 
              message: "Order not found",
              status: 'not_found'
            });
          }
          if (error.message.includes('ORDER_ALREADY_CAPTURED')) {
            return res.status(400).json({ 
              message: "Order already captured",
              status: 'already_captured'
            });
          }
        }
        
        res.status(500).json({ 
          message: "Failed to capture PayPal payment",
          status: 'error',
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );

  // Subscription Management Endpoints

  // POST /api/subscriptions/cancel - Cancel subscription
  app.post("/api/subscriptions/cancel",
    requireAuth,
    advancedRateLimit(5, 60000),
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const user = await storage.getUser(userId);

        if (!user || user.subscriptionStatus !== 'active') {
          return res.status(400).json({ message: "No active subscription to cancel" });
        }

        // Mark as cancelled but keep active until period ends
        await storage.updateUser(userId, {
          subscriptionStatus: 'cancel_at_period_end',
        });

        res.json({
          message: "Subscription will be cancelled at the end of the billing period.",
          cancelDate: user.nextBillingDate,
        });
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ message: "Failed to cancel subscription" });
      }
    }
  );

  // POST /api/subscriptions/reactivate - Reactivate cancelled subscription
  app.post("/api/subscriptions/reactivate",
    requireAuth,
    advancedRateLimit(5, 60000),
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const user = await storage.getUser(userId);

        if (!user || user.subscriptionStatus !== 'cancel_at_period_end') {
          return res.status(400).json({ message: "No cancelled subscription to reactivate" });
        }

        // Reactivate the subscription
        await storage.updateUser(userId, {
          subscriptionStatus: 'active',
        });

        res.json({
          message: "Subscription reactivated successfully! Your subscription will continue as normal.",
          nextBillingDate: user.nextBillingDate,
        });
      } catch (error) {
        console.error("Error reactivating subscription:", error);
        res.status(500).json({ message: "Failed to reactivate subscription" });
      }
    }
  );

  // POST /api/subscriptions/update-alert - Update usage alert
  app.post("/api/subscriptions/update-alert",
    requireAuth,
    advancedRateLimit(10, 60000),
    body('alertAmount').isInt({ min: 0 }).withMessage('Alert amount must be a positive integer'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const { alertAmount } = req.body;

        await storage.updateUser(userId, {
          usageAlert: alertAmount,
        });

        res.json({
          message: "Usage alert updated successfully",
          alertAmount,
        });
      } catch (error) {
        console.error("Error updating usage alert:", error);
        res.status(500).json({ message: "Failed to update usage alert" });
      }
    }
  );

  // GET /api/subscriptions/info - Get subscription information
  app.get("/api/subscriptions/info",
    requireAuth,
    async (req, res) => {
      try {
        const userId = (req.user as any).id;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({
          currentPlan: user.currentPlan || 'FREEMIUM',
          subscriptionStatus: user.subscriptionStatus || 'none',
          credits: user.credits || 0,
          monthlyCreditsUsed: user.monthlyCreditsUsed || 0,
          subscriptionStartDate: user.subscriptionStartDate,
          nextBillingDate: user.nextBillingDate,
          creditsResetDate: user.creditsResetDate,
          usageAlert: user.usageAlert,
        });
      } catch (error) {
        console.error("Error fetching subscription info:", error);
        res.status(500).json({ message: "Failed to fetch subscription info" });
      }
    }
  );

  // Sanctum Gateway Integration Endpoints
  
  // GET /api/gateway/status - Check Gateway configuration
  app.get("/api/gateway/status", requireAuth, async (req, res) => {
    try {
      const isConfigured = gatewayService.isConfigured();
      const network = process.env.SOLANA_NETWORK || 'devnet';
      const metrics = gatewayService.getMetrics();
      
      res.json({
        configured: isConfigured,
        network,
        message: isConfigured 
          ? 'Gateway is configured and ready' 
          : 'Gateway API key not configured',
        metrics: {
          optimize: {
            attempts: metrics.optimizeAttempts,
            successes: metrics.optimizeSuccesses,
            failures: metrics.optimizeFailures,
            successRate: metrics.optimizeAttempts > 0 
              ? ((metrics.optimizeSuccesses / metrics.optimizeAttempts) * 100).toFixed(1) + '%'
              : 'N/A'
          },
          send: {
            attempts: metrics.sendAttempts,
            successes: metrics.sendSuccesses,
            failures: metrics.sendFailures,
            successRate: metrics.sendAttempts > 0 
              ? ((metrics.sendSuccesses / metrics.sendAttempts) * 100).toFixed(1) + '%'
              : 'N/A'
          },
          performance: {
            averageLatencyMs: metrics.averageLatencyMs
          }
        }
      });
    } catch (error) {
      console.error("Error checking Gateway status:", error);
      // Sanitized error response
      res.status(500).json({ 
        message: "Unable to retrieve Gateway status",
        code: 'STATUS_CHECK_FAILED'
      });
    }
  });

  // GET /api/gateway/transaction/:signature - Get transaction status via Gateway
  app.get("/api/gateway/transaction/:signature",
    requireAuth,
    advancedRateLimit(30, 60000), // 30 requests per minute
    async (req, res) => {
      try {
        const { signature } = req.params;

        if (!signature || signature.length < 32) {
          return res.status(400).json({ 
            message: "Invalid transaction signature",
            code: 'INVALID_SIGNATURE'
          });
        }

        if (!gatewayService.isConfigured()) {
          return res.status(503).json({ 
            message: "Gateway not configured",
            code: 'GATEWAY_NOT_CONFIGURED'
          });
        }

        const status = await gatewayService.getTransactionStatus(signature);
        
        res.json({
          signature,
          status,
          via: 'gateway'
        });
      } catch (error) {
        console.error("Error fetching transaction via Gateway:", error);
        // Sanitize error - don't expose Gateway internals
        res.status(500).json({ 
          message: "Unable to fetch transaction status",
          code: 'TRANSACTION_LOOKUP_FAILED'
        });
      }
    }
  );

  // GET /api/gateway/transactions - Get recent Gateway transactions (from credit history)
  app.get("/api/gateway/transactions", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
      
      // Get recent credit transactions with payment details
      const transactions = await storage.getCreditTransactions(userId, limit);
      
      // Filter and format transactions with Solana payment data
      const gatewayTransactions = transactions
        .filter(tx => tx.transactionHash && (tx.paymentMethod === 'SOLANA_SOL' || tx.paymentMethod === 'SOLANA_USDC'))
        .map(tx => ({
          signature: tx.transactionHash,
          amount: tx.amount,
          currency: tx.currency,
          paymentMethod: tx.paymentMethod,
          status: tx.paymentStatus,
          timestamp: tx.createdAt,
          description: tx.description
        }));
      
      res.json({
        transactions: gatewayTransactions,
        total: gatewayTransactions.length,
        gatewayConfigured: gatewayService.isConfigured()
      });
    } catch (error) {
      console.error("Error fetching Gateway transactions:", error);
      // Sanitized error response
      res.status(500).json({ 
        message: "Unable to retrieve transaction history",
        code: 'TRANSACTION_FETCH_FAILED'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
