import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username").unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  avatar: text("avatar"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const startupIdeas = pgTable("startup_ideas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  ideaTitle: text("idea_title").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  stage: text("stage").notNull(),
  analysis: jsonb("analysis"),
  businessPlan: jsonb("business_plan"),
  pitchDeck: jsonb("pitch_deck"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  stage: text("stage").notNull(),
  location: text("location"),
  teamSize: text("team_size"),
  theme: text("theme").default("modern"),
  logoUrl: text("logo_url"),
  companyData: jsonb("company_data"),
  workflowProgress: jsonb("workflow_progress"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // "financial", "legal", "business", "technical", "marketing"
  category: text("category").notNull(),
  size: text("size"),
  status: text("status").default("draft"), // "complete", "draft", "review", "missing"
  confidentiality: text("confidentiality").default("confidential"), // "public", "confidential", "restricted"
  uploadedBy: text("uploaded_by"),
  description: text("description"),
  fileUrl: text("file_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStartupIdeaSchema = createInsertSchema(startupIdeas).pick({
  name: true,
  email: true,
  ideaTitle: true,
  description: true,
  industry: true,
  stage: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  companyName: true,
  description: true,
  industry: true,
  stage: true,
  location: true,
  teamSize: true,
  theme: true,
  logoUrl: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  companyId: true,
  name: true,
  type: true,
  category: true,
  size: true,
  status: true,
  confidentiality: true,
  uploadedBy: true,
  description: true,
  fileUrl: true,
});

export type InsertStartupIdea = z.infer<typeof insertStartupIdeaSchema>;
export type StartupIdea = typeof startupIdeas.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
