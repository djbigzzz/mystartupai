import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  username: text("username").unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  walletAddress: text("wallet_address").unique(),
  walletType: text("wallet_type"), // metamask, rabby, phantom, walletconnect
  chainId: integer("chain_id"),
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
  targetMarket: text("target_market"),
  problemStatement: text("problem_statement"),
  solutionApproach: text("solution_approach"),
  competitiveAdvantage: text("competitive_advantage"),
  revenueModel: text("revenue_model"),
  analysis: jsonb("analysis"),
  businessPlan: jsonb("business_plan"),
  pitchDeck: jsonb("pitch_deck"),
  validationScore: integer("validation_score"),
  analysisStatus: text("analysis_status").default("pending"),
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
  targetMarket: true,
  problemStatement: true,
  solutionApproach: true,
  competitiveAdvantage: true,
  revenueModel: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  walletType: true,
  chainId: true,
  name: true,
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

// Events and networking schemas
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // startup, tech, networking, demo_day, conference
  category: text("category").notNull(), // workshop, pitch_competition, networking, conference
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  isVirtual: boolean("is_virtual").default(false),
  virtualLink: text("virtual_link"),
  organizerName: text("organizer_name"),
  organizerEmail: text("organizer_email"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  price: text("price").default("0.00"),
  registrationUrl: text("registration_url"),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  requirements: text("requirements"),
  agenda: jsonb("agenda"), // Array of agenda items
  speakers: jsonb("speakers"), // Array of speaker objects
  benefits: text("benefits").array(),
  status: text("status").default("upcoming"), // upcoming, ongoing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  registrationDate: timestamp("registration_date").defaultNow(),
  status: text("status").default("registered"), // registered, attended, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // pending, accepted, declined, blocked
  message: text("message"),
  connectionDate: timestamp("connection_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const networkingProfiles = pgTable("networking_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bio: text("bio"),
  interests: text("interests").array(),
  skills: text("skills").array(),
  industries: text("industries").array(),
  lookingFor: text("looking_for").array(), // mentor, cofounder, investor, advisor, customer
  stage: text("stage"), // idea, mvp, growth, scaling
  availableForMentoring: boolean("available_for_mentoring").default(false),
  seekingMentorship: boolean("seeking_mentorship").default(false),
  openToCollaboration: boolean("open_to_collaboration").default(false),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  location: text("location"),
  timezone: text("timezone"),
  preferredContactMethod: text("preferred_contact_method").default("platform"), // platform, email, linkedin
  visibility: text("visibility").default("public"), // public, connections, private
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  type: true,
  category: true,
  startDate: true,
  endDate: true,
  location: true,
  isVirtual: true,
  virtualLink: true,
  organizerName: true,
  organizerEmail: true,
  maxAttendees: true,
  price: true,
  registrationUrl: true,
  tags: true,
  imageUrl: true,
  requirements: true,
  agenda: true,
  speakers: true,
  benefits: true,
  status: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).pick({
  eventId: true,
  userId: true,
  status: true,
  notes: true,
});

export const insertConnectionSchema = createInsertSchema(connections).pick({
  requesterId: true,
  receiverId: true,
  status: true,
  message: true,
  connectionDate: true,
});

export const insertNetworkingProfileSchema = createInsertSchema(networkingProfiles).pick({
  userId: true,
  bio: true,
  interests: true,
  skills: true,
  industries: true,
  lookingFor: true,
  stage: true,
  availableForMentoring: true,
  seekingMentorship: true,
  openToCollaboration: true,
  linkedinUrl: true,
  twitterUrl: true,
  githubUrl: true,
  websiteUrl: true,
  location: true,
  timezone: true,
  preferredContactMethod: true,
  visibility: true,
});

export type InsertStartupIdea = z.infer<typeof insertStartupIdeaSchema>;
export type StartupIdea = typeof startupIdeas.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;
export type InsertNetworkingProfile = z.infer<typeof insertNetworkingProfileSchema>;
export type NetworkingProfile = typeof networkingProfiles.$inferSelect;

// Waitlist table for building in public launch
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  walletAddress: varchar("wallet_address", { length: 42 }).unique(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  source: varchar("source", { length: 50 }).notNull().default("email"), // email, google, wallet
  earlyAccess: boolean("early_access").default(false),
  referralCode: varchar("referral_code", { length: 20 }),
  referredBy: varchar("referred_by", { length: 20 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
  name: true,
  walletAddress: true,
  googleId: true,
  source: true,
  referralCode: true,
  referredBy: true,
  metadata: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export const startupProfiles = pgTable("startup_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  description: text("description"),
  industry: text("industry"),
  stage: text("stage"),
  location: text("location"),
  teamSize: text("team_size"),
  fundingGoal: text("funding_goal"),
  targetMarket: text("target_market"),
  problemStatement: text("problem_statement"),
  solutionApproach: text("solution_approach"),
  competitiveAdvantage: text("competitive_advantage"),
  revenueModel: text("revenue_model"),
  completionPercentage: integer("completion_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStartupProfileSchema = createInsertSchema(startupProfiles);
export type InsertStartupProfile = typeof startupProfiles.$inferInsert;
export type StartupProfile = typeof startupProfiles.$inferSelect;
