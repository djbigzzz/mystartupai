import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStartupIdeaSchema, insertCompanySchema, insertDocumentSchema } from "@shared/schema";
import { analyzeStartupIdea, generateBusinessPlan, generatePitchDeck } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password (simple implementation for demo)
      const hashedPassword = password; // TODO: Implement proper hashing

      const user = await storage.createUser({
        username: email,
        password: hashedPassword,
      });

      // Set session
      req.session = { userId: user.id };

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByUsername(email);
      if (!user || user.password !== password) { // TODO: Implement proper password verification
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session = { userId: user.id };

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.session?.userId;
      
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
      req.session = null;
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
