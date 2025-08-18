import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "./auth";
import { storage } from "./storage";
import { insertStartupIdeaSchema, insertCompanySchema, insertDocumentSchema, insertUserSchema, insertWaitlistSchema, insertStartupProfileSchema } from "@shared/schema";
import { analyzeStartupIdea, generateBusinessPlan, generatePitchDeck } from "./openai";
import { agenticAI } from "./agentic-ai";
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
    passport.authenticate('local', { 
      failureMessage: true,
      failWithError: true 
    }), 
    (req, res) => {
      // Clean user data before sending response
      const user = req.user as any;
      const cleanUser = cleanUserDataForResponse(user);
      res.json({ user: cleanUser });
    }
  );

  app.post("/api/auth/logout", (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    // Check both Passport.js and manual session authentication
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const cleanUser = cleanUserDataForResponse(user);
      res.json(cleanUser);
    } else if ((req.session as any)?.userId) {
      // Manual session authentication (for manual OAuth)
      const user = (req.session as any).user;
      const cleanUser = cleanUserDataForResponse(user);
      res.json(cleanUser);
    } else {
      res.status(401).json({ message: "Unauthorized" });
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
    validatePassword.withMessage('New password must meet security requirements'),
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

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      res.redirect('/dashboard');
    }
  );


  
  // Submit startup idea for analysis with comprehensive validation
  app.post("/api/ideas", 
    advancedRateLimit(10, 15 * 60 * 1000), // 10 idea submissions per 15 minutes
    validateStartupIdea,
    handleValidationErrors,
    async (req, res) => {
      try {
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
        
        // Create the idea record
        const idea = await storage.createStartupIdea(validatedData);
        
        // Generate AI analysis with sanitized inputs
        const analysis = await analyzeStartupIdea(
          idea.ideaTitle,
          idea.description,
          idea.industry,
          idea.stage
        );
        
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

  // Get startup idea by ID with validation
  app.get("/api/ideas/:id", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const idea = await storage.getStartupIdea(id);
        
        if (!idea) {
          return res.status(404).json({ message: "Startup idea not found" });
        }
        
        res.json(idea);
      } catch (error) {
        console.error("Error fetching idea:", error);
        res.status(500).json({ message: "Failed to fetch idea" });
      }
    }
  );

  // Get startup ideas by email (protected route)
  app.get("/api/ideas", requireAuth, async (req, res) => {
    try {
      const email = req.query.email as string;
      
      // Validate email parameter
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Valid email parameter is required" });
      }
      
      const ideas = await storage.getStartupIdeasByEmail(email);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });

  // Generate comprehensive business plan
  app.post("/api/startup-ideas/:id/business-plan", requireAuth, async (req, res) => {
    try {
      const ideaId = parseInt(req.params.id);
      const idea = await storage.getStartupIdea(ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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

      res.json(sectionsData);
    } catch (error) {
      console.error("Error generating business plan:", error);
      res.status(500).json({ message: "Failed to generate business plan" });
    }
  });

  // Generate business plan for an idea
  app.post("/api/ideas/:id/business-plan", 
    requireAuth,
    validateId,
    handleValidationErrors,
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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
      
      res.json(updatedIdea);
    } catch (error) {
      console.error("Error generating business plan:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate business plan" 
      });
    }
  });

  // Generate pitch deck for an idea
  app.post("/api/ideas/:id/pitch-deck", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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
        ...req.body,
        name: sanitizeHtml(req.body.name.trim()),
        description: req.body.description ? sanitizeHtml(req.body.description.trim()) : undefined,
        industry: req.body.industry ? sanitizeQuery(req.body.industry.trim()) : undefined,
        stage: req.body.stage ? sanitizeQuery(req.body.stage) : 'idea',
        userId
      };
      
      const validatedData = insertCompanySchema.parse(sanitizedData);
      const company = await storage.createCompany(validatedData);
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
      const company = await storage.getCompany(id);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
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

  // Legacy authentication routes (will be replaced by Passport routes)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
        emailVerified: false
      });

      // Set session
      (req.session as any).userId = user.id;

      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
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
      const idea = await storage.getStartupIdea(ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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
      const idea = await storage.getStartupIdea(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Startup idea not found" });
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

  const httpServer = createServer(app);
  return httpServer;
}
