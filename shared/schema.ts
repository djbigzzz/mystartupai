import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  username: text("username").unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  
  // Web3 wallet authentication
  walletAddressSolana: text("wallet_address_solana").unique(),
  walletAddressEthereum: text("wallet_address_ethereum").unique(),
  authMethod: text("auth_method").default("email"), // email, google, phantom, metamask, walletconnect

  // Credit and payment system
  credits: integer("credits").default(200), // Current available credits
  currentPlan: text("current_plan").default("FREEMIUM"), // FREEMIUM, CORE, PRO
  
  // Subscription management
  subscriptionStatus: text("subscription_status").default("none"), // active, cancelled, expired, none
  subscriptionStartDate: timestamp("subscription_start_date"),
  nextBillingDate: timestamp("next_billing_date"),
  creditsResetDate: timestamp("credits_reset_date"),
  monthlyCreditsUsed: integer("monthly_credits_used").default(0), // Overage credits used this billing cycle
  usageAlert: integer("usage_alert"), // Spending alert threshold in dollars
  
  stripeCustomerId: text("stripe_customer_id"),
  paypalCustomerId: text("paypal_customer_id"),

  avatar: text("avatar"),
  emailVerified: boolean("email_verified").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  
  // Two-Factor Authentication
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const startupIdeas = pgTable("startup_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
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

export const startupProfiles = pgTable("startup_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  
  // Phase 1: Quick Start - Minimal Input
  startupVision: text("startup_vision"),
  
  // AI-extracted/suggested fields
  suggestedCompanyName: text("suggested_company_name"),
  suggestedIndustry: text("suggested_industry"),
  suggestedProblem: text("suggested_problem"),
  suggestedSolution: text("suggested_solution"),
  
  // Phase 2: Guided Completion - Structured Data
  companyName: text("company_name"),
  industry: text("industry"),
  stage: text("stage"),
  location: text("location"),
  teamSize: text("team_size"),
  description: text("description"),
  problemStatement: text("problem_statement"),
  solutionApproach: text("solution_approach"),
  targetMarket: text("target_market"),
  competitiveAdvantage: text("competitive_advantage"),
  revenueModel: text("revenue_model"),
  fundingGoal: text("funding_goal"),
  
  // Phase 3: Advanced Details - Deep Dive
  customerPersonas: text("customer_personas"),
  marketSize: text("market_size"),
  competitorAnalysis: text("competitor_analysis"),
  businessModelDetails: text("business_model_details"),
  financialAssumptions: text("financial_assumptions"),
  marketingChannels: text("marketing_channels"),
  keyMetrics: text("key_metrics"),
  technologyStack: text("technology_stack"),
  intellectualProperty: text("intellectual_property"),
  regulatoryConsiderations: text("regulatory_considerations"),
  
  // Progress tracking
  currentPhase: text("current_phase").default("quick-start"),
  completionPercentage: integer("completion_percentage").default(0),
  phaseCompletions: jsonb("phase_completions"),
  
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

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
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

export const insertStartupProfileSchema = createInsertSchema(startupProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;

export type StartupIdea = typeof startupIdeas.$inferSelect;
export type InsertStartupIdea = z.infer<typeof insertStartupIdeaSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type StartupProfile = typeof startupProfiles.$inferSelect;
export type InsertStartupProfile = z.infer<typeof insertStartupProfileSchema>;

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

// Duplicate exports removed - already defined above
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

// Demo Session schemas for unified demo experience
export const demoSessions = pgTable("demo_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  ideaTitle: text("idea_title").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  targetMarket: text("target_market"),
  problemStatement: text("problem_statement"),
  solutionApproach: text("solution_approach"),
  competitiveAdvantage: text("competitive_advantage"),
  revenueModel: text("revenue_model"),
  brandColors: jsonb("brand_colors"), // extracted theme colors
  completedArtifacts: text("completed_artifacts").array().default([]),
  progress: jsonb("progress"), // completion tracking per demo
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const artifacts = pgTable("artifacts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => demoSessions.sessionId).notNull(),
  type: text("type").notNull(), // "business-plan", "pitch-deck", "financial-model", etc.
  title: text("title").notNull(),
  summary: text("summary"),
  content: jsonb("content").notNull(), // structured artifact data
  exportUrls: jsonb("export_urls"), // PDF, PNG, shareable links
  generationStatus: text("generation_status").default("pending"), // pending, generating, completed, error
  quality: integer("quality"), // 1-100 quality score
  insights: text("insights").array(), // key takeaways or recommendations
  crossLinks: jsonb("cross_links"), // references to other artifacts
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDemoSessionSchema = createInsertSchema(demoSessions).pick({
  sessionId: true,
  ideaTitle: true,
  description: true,
  industry: true,
  targetMarket: true,
  problemStatement: true,
  solutionApproach: true,
  competitiveAdvantage: true,
  revenueModel: true,
  brandColors: true,
});

export const insertArtifactSchema = createInsertSchema(artifacts).pick({
  sessionId: true,
  type: true,
  title: true,
  summary: true,
  content: true,
  exportUrls: true,
  generationStatus: true,
  quality: true,
  insights: true,
  crossLinks: true,
});

export type DemoSession = typeof demoSessions.$inferSelect;
export type InsertDemoSession = z.infer<typeof insertDemoSessionSchema>;
export type Artifact = typeof artifacts.$inferSelect;
export type InsertArtifact = z.infer<typeof insertArtifactSchema>;

// Gamification schemas
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  nextLevelXp: integer("next_level_xp").default(100),
  streakDays: integer("streak_days").default(0),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  description: text("description").notNull(),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  criteria: text("criteria").notNull(), // Achievement criteria
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly
  target: integer("target").notNull(), // target number to complete
  metric: text("metric").notNull(), // ideas_submitted, business_plans_generated, etc.
  rewardXp: integer("reward_xp").notNull(),
  rewardPoints: integer("reward_points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userQuests = pgTable("user_quests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  questId: integer("quest_id").references(() => quests.id).notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  claimed: boolean("claimed").default(false),
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
  periodStart: timestamp("period_start").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
  createdAt: true,
});

export const insertUserQuestSchema = createInsertSchema(userQuests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type UserQuest = typeof userQuests.$inferSelect;
export type InsertUserQuest = z.infer<typeof insertUserQuestSchema>;

// Daily Check-ins
export const dailyCheckins = pgTable("daily_checkins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  checkinDate: timestamp("checkin_date").notNull().defaultNow(),
  xpAwarded: integer("xp_awarded").default(50),
  streakDay: integer("streak_day").default(1), // What day of the streak this was
  bonusXp: integer("bonus_xp").default(0), // Extra XP for milestones
  mood: text("mood"), // optional: happy, motivated, focused, etc.
  note: text("note"), // optional: personal note about the day
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Unique constraint to prevent duplicate check-ins per calendar day
  uniqueUserDate: sql`UNIQUE (user_id, DATE(checkin_date AT TIME ZONE 'UTC'))`
}));

export const insertDailyCheckinSchema = createInsertSchema(dailyCheckins).omit({
  id: true,
  createdAt: true,
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = z.infer<typeof insertDailyCheckinSchema>;

// Credit transactions table for payment and usage history
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // "purchase", "usage", "refund", "bonus"
  amount: integer("amount").notNull(), // Positive for purchases, negative for usage
  balance: integer("balance").notNull(), // Balance after transaction
  description: text("description").notNull(),
  
  // Payment details (for purchases)
  paymentMethod: text("payment_method"), // "solana", "paypal", "stripe", "bonus"
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }), // USD amount paid
  currency: text("currency").default("USD"), // USD, SOL, USDC
  transactionHash: text("transaction_hash"), // Solana transaction signature
  paymentStatus: text("payment_status").default("completed"), // pending, completed, failed, refunded
  
  // Feature usage tracking (for usage transactions)
  featureUsed: text("feature_used"), // "business_plan", "pitch_deck", "market_research"
  relatedIdeaId: integer("related_idea_id").references(() => startupIdeas.id),
  
  metadata: jsonb("metadata"), // Additional data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;


