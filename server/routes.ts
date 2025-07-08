import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "./auth";
import { storage } from "./storage";
import { insertStartupIdeaSchema, insertCompanySchema, insertDocumentSchema, insertUserSchema, insertWaitlistSchema } from "@shared/schema";
import { analyzeStartupIdea, generateBusinessPlan, generatePitchDeck } from "./openai";
import { agenticAI } from "./agentic-ai";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, name, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
        emailVerified: false
      });

      res.json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

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
  
  // Submit startup idea for analysis
  app.post("/api/ideas", async (req, res) => {
    try {
      const validatedData = insertStartupIdeaSchema.parse(req.body);
      
      // Create the idea record
      const idea = await storage.createStartupIdea(validatedData);
      
      // Generate AI analysis
      const analysis = await analyzeStartupIdea(
        idea.ideaTitle,
        idea.description,
        idea.industry,
        idea.stage
      );
      
      // Update the idea with analysis
      const updatedIdea = await storage.updateStartupIdea(idea.id, { analysis });
      
      res.json(updatedIdea);
    } catch (error) {
      console.error("Error creating idea:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create idea" 
      });
    }
  });

  // Get startup idea by ID
  app.get("/api/ideas/:id", async (req, res) => {
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
  });

  // Get startup ideas by email
  app.get("/api/ideas", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({ message: "Email parameter is required" });
      }
      
      const ideas = await storage.getStartupIdeasByEmail(email);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });

  // Generate comprehensive business plan
  app.post("/api/startup-ideas/:id/business-plan", async (req, res) => {
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
  app.post("/api/ideas/:id/business-plan", async (req, res) => {
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
  app.post("/api/ideas/:id/pitch-deck", async (req, res) => {
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
  app.post("/api/companies", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const userId = req.body.userId || 1; // TODO: Get from session/auth
      
      const company = await storage.createCompany({ ...validatedData, userId });
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create company" 
      });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
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

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const company = await storage.updateCompany(id, updates);
      
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
  app.post("/api/companies/:companyId/documents", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const validatedData = insertDocumentSchema.parse({ ...req.body, companyId });
      
      const document = await storage.createDocument(validatedData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create document" 
      });
    }
  });

  app.get("/api/companies/:companyId/documents", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const documents = await storage.getDocumentsByCompany(companyId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const document = await storage.updateDocument(id, updates);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

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

  // Generate pitch deck
  app.post("/api/startup-ideas/:id/pitch-deck", async (req, res) => {
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
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse({
        ...req.body,
        source: "email"
      });
      
      // Check if email already exists
      const existing = await storage.getWaitlistEntry(validatedData.email!);
      if (existing) {
        return res.status(400).json({ message: "Email already on waitlist" });
      }

      const entry = await storage.createWaitlistEntry(validatedData);
      res.json(entry);
    } catch (error: any) {
      console.error("Waitlist signup error:", error);
      res.status(400).json({ message: error.message || "Failed to join waitlist" });
    }
  });

  app.post("/api/waitlist/email", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse({
        ...req.body,
        source: "email"
      });
      
      // Check if email already exists
      const existing = await storage.getWaitlistEntry(validatedData.email!);
      if (existing) {
        return res.status(400).json({ message: "Email already on waitlist" });
      }

      const entry = await storage.createWaitlistEntry(validatedData);
      res.json(entry);
    } catch (error: any) {
      console.error("Waitlist email signup error:", error);
      res.status(400).json({ message: error.message || "Failed to join waitlist" });
    }
  });

  app.post("/api/waitlist/wallet", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address required" });
      }

      // Check if wallet already exists
      const existing = await storage.getWaitlistByWallet(walletAddress);
      if (existing) {
        return res.status(400).json({ message: "Wallet already on waitlist" });
      }

      const entry = await storage.createWaitlistEntry({
        walletAddress,
        source: "wallet"
      });
      
      res.json(entry);
    } catch (error: any) {
      console.error("Waitlist wallet signup error:", error);
      res.status(400).json({ message: error.message || "Failed to join waitlist" });
    }
  });

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
  app.post("/api/agentic/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await agenticAI.processUserMessage(message, context);
      res.json(response);
    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  app.post("/api/agentic/execute-task", async (req, res) => {
    try {
      const { action } = req.body;
      
      if (!action) {
        return res.status(400).json({ message: "Action is required" });
      }

      const task = await agenticAI.executeAutonomousTask(action);
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

  app.get("/api/agentic/investors", async (req, res) => {
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

  app.get("/api/agentic/profile", async (req, res) => {
    try {
      const profile = agenticAI.getProfile();
      res.json(profile);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
