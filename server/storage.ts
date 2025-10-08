import { 
  users, 
  startupIdeas, 
  companies, 
  documents,
  events,
  eventRegistrations,
  connections,
  networkingProfiles,
  waitlist,
  startupProfiles,
  passwordResetTokens,
  demoSessions,
  artifacts,
  userProgress,
  badges,
  userBadges,
  quests,
  userQuests,
  dailyCheckins,
  creditTransactions,
  type User, 
  type InsertUser, 
  type StartupIdea, 
  type InsertStartupIdea,
  type Company,
  type InsertCompany,
  type Document,
  type InsertDocument,
  type Event,
  type InsertEvent,
  type EventRegistration,
  type InsertEventRegistration,
  type Connection,
  type InsertConnection,
  type NetworkingProfile,
  type InsertNetworkingProfile,
  type Waitlist,
  type InsertWaitlist,
  type StartupProfile,
  type InsertStartupProfile,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type DemoSession,
  type InsertDemoSession,
  type Artifact,
  type InsertArtifact,
  type UserProgress,
  type InsertUserProgress,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type InsertUserBadge,
  type Quest,
  type InsertQuest,
  type UserQuest,
  type InsertUserQuest,
  type DailyCheckin,
  type InsertDailyCheckin,
  type CreditTransaction,
  type InsertCreditTransaction,
} from "@shared/schema";
import { db, withRetryRead } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserBySolanaWallet(walletAddress: string): Promise<User | undefined>;
  getUserByEthereumWallet(walletAddress: string): Promise<User | undefined>;

  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Password reset operations
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenAsUsed(token: string): Promise<boolean>;
  deleteExpiredPasswordResetTokens(): Promise<void>;
  
  // Startup Ideas operations
  createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea>;
  getStartupIdea(id: number): Promise<StartupIdea | undefined>;
  updateStartupIdea(id: number, updates: Partial<StartupIdea>): Promise<StartupIdea | undefined>;
  getStartupIdeasByEmail(email: string): Promise<StartupIdea[]>;
  getStartupIdeasByUserId(userId: number): Promise<StartupIdea[]>;
  
  // Company operations
  createCompany(company: InsertCompany & { userId: number }): Promise<Company>;
  getCompany(id: number): Promise<Company | undefined>;
  getCompaniesByUser(userId: number): Promise<Company[]>;
  updateCompany(id: number, updates: Partial<Company>): Promise<Company | undefined>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByCompany(companyId: number): Promise<Document[]>;
  updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(filters?: { type?: string; category?: string; location?: string }): Promise<Event[]>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Event registration operations
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  getUserRegistrations(userId: number): Promise<EventRegistration[]>;
  updateEventRegistration(id: number, updates: Partial<EventRegistration>): Promise<EventRegistration | undefined>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnection(id: number): Promise<Connection | undefined>;
  getUserConnections(userId: number): Promise<Connection[]>;
  getPendingConnections(userId: number): Promise<Connection[]>;
  updateConnection(id: number, updates: Partial<Connection>): Promise<Connection | undefined>;
  
  // Networking profile operations
  createNetworkingProfile(profile: InsertNetworkingProfile): Promise<NetworkingProfile>;
  getNetworkingProfile(userId: number): Promise<NetworkingProfile | undefined>;
  getNetworkingProfiles(filters?: { stage?: string; industries?: string[]; lookingFor?: string[] }): Promise<NetworkingProfile[]>;
  updateNetworkingProfile(userId: number, updates: Partial<NetworkingProfile>): Promise<NetworkingProfile | undefined>;
  
  // Waitlist operations
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntry(email: string): Promise<Waitlist | undefined>;

  getWaitlistByGoogleId(googleId: string): Promise<Waitlist | undefined>;
  getWaitlistCount(): Promise<number>;
  getWaitlistEntries(): Promise<Waitlist[]>;
  
  // Startup Profile operations
  createStartupProfile(profile: InsertStartupProfile): Promise<StartupProfile>;
  getStartupProfile(userId: number): Promise<StartupProfile | undefined>;
  updateStartupProfile(id: number, updates: Partial<StartupProfile>): Promise<StartupProfile | undefined>;
  
  // Demo Session operations
  createDemoSession(session: InsertDemoSession): Promise<DemoSession>;
  getDemoSession(sessionId: string): Promise<DemoSession | undefined>;
  updateDemoSession(sessionId: string, updates: Partial<DemoSession>): Promise<DemoSession | undefined>;
  
  // Artifact operations
  createArtifact(artifact: InsertArtifact): Promise<Artifact>;
  getArtifact(id: number): Promise<Artifact | undefined>;
  getArtifactsBySession(sessionId: string): Promise<Artifact[]>;
  getArtifactByType(sessionId: string, type: string): Promise<Artifact | undefined>;
  updateArtifact(id: number, updates: Partial<Artifact>): Promise<Artifact | undefined>;
  
  // Gamification operations
  // User Progress
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  awardXp(userId: number, xp: number, reason: string): Promise<{ leveledUp: boolean; newLevel?: number }>;
  updateStreak(userId: number): Promise<UserProgress | undefined>;
  
  // Badges
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<UserBadge[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge>;
  checkBadgeEligibility(userId: number): Promise<Badge[]>;
  
  // Quests
  getActiveQuests(): Promise<Quest[]>;
  getUserQuests(userId: number): Promise<UserQuest[]>;
  createUserQuest(userQuest: InsertUserQuest): Promise<UserQuest>;
  updateQuestProgress(userId: number, questId: number, progress: number): Promise<UserQuest | undefined>;
  completeQuest(userId: number, questId: number): Promise<UserQuest | undefined>;
  claimQuest(userId: number, questId: number): Promise<{ xp: number; points: number }>;
  resetUserQuests(userId: number, period: string): Promise<void>;
  
  // Credit operations
  getUserCredits(userId: number): Promise<number>;
  addCredits(userId: number, amount: number, description: string, paymentDetails?: Partial<CreditTransaction>): Promise<CreditTransaction>;
  deductCredits(userId: number, amount: number, description: string, featureUsed?: string, relatedIdeaId?: number): Promise<CreditTransaction>;
  getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]>;
  getCreditTransaction(id: number): Promise<CreditTransaction | undefined>;
  getCreditTransactionBySignature(signature: string): Promise<CreditTransaction | undefined>;
  getCreditBalance(userId: number): Promise<{ credits: number; transactions: CreditTransaction[] }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return await withRetryRead(async () => {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await withRetryRead(async () => {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    });
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return await withRetryRead(async () => {
      const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
      return user || undefined;
    });
  }

  async getUserBySolanaWallet(walletAddress: string): Promise<User | undefined> {
    return await withRetryRead(async () => {
      const [user] = await db.select().from(users).where(eq(users.walletAddressSolana, walletAddress));
      return user || undefined;
    });
  }

  async getUserByEthereumWallet(walletAddress: string): Promise<User | undefined> {
    return await withRetryRead(async () => {
      const [user] = await db.select().from(users).where(eq(users.walletAddressEthereum, walletAddress));
      return user || undefined;
    });
  }



  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createStartupIdea(insertIdea: InsertStartupIdea): Promise<StartupIdea> {
    const [idea] = await db
      .insert(startupIdeas)
      .values({
        ...insertIdea,
        analysisStatus: "pending",
        validationScore: null
      })
      .returning();
    return idea;
  }

  async getStartupIdea(id: number): Promise<StartupIdea | undefined> {
    const [idea] = await db.select().from(startupIdeas).where(eq(startupIdeas.id, id));
    return idea || undefined;
  }

  async updateStartupIdea(id: number, updates: Partial<StartupIdea>): Promise<StartupIdea | undefined> {
    const [updatedIdea] = await db
      .update(startupIdeas)
      .set(updates)
      .where(eq(startupIdeas.id, id))
      .returning();
    return updatedIdea || undefined;
  }

  async getStartupIdeasByEmail(email: string): Promise<StartupIdea[]> {
    return await db.select().from(startupIdeas).where(eq(startupIdeas.email, email));
  }

  async getStartupIdeasByUserId(userId: number): Promise<StartupIdea[]> {
    return await db.select().from(startupIdeas).where(eq(startupIdeas.userId, userId));
  }

  // Company operations
  async createCompany(insertCompany: InsertCompany & { userId: number }): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(insertCompany)
      .returning();
    return company;
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompaniesByUser(userId: number): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company | undefined> {
    const [company] = await db
      .update(companies)
      .set(updates)
      .where(eq(companies.id, id))
      .returning();
    return company || undefined;
  }

  // Document operations
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async getDocumentsByCompany(companyId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.companyId, companyId));
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    return document || undefined;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Event operations
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEvents(filters?: { type?: string; category?: string; location?: string }): Promise<Event[]> {
    return await db.select().from(events);
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Event registration operations
  async registerForEvent(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const [registration] = await db
      .insert(eventRegistrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, userId)));
    return registration;
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
  }

  async getUserRegistrations(userId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId));
  }

  async updateEventRegistration(id: number, updates: Partial<EventRegistration>): Promise<EventRegistration | undefined> {
    const [registration] = await db
      .update(eventRegistrations)
      .set(updates)
      .where(eq(eventRegistrations.id, id))
      .returning();
    return registration;
  }

  // Connection operations
  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const [connection] = await db
      .insert(connections)
      .values(insertConnection)
      .returning();
    return connection;
  }

  async getConnection(id: number): Promise<Connection | undefined> {
    const [connection] = await db.select().from(connections).where(eq(connections.id, id));
    return connection;
  }

  async getUserConnections(userId: number): Promise<Connection[]> {
    return await db.select().from(connections).where(eq(connections.status, "accepted"));
  }

  async getPendingConnections(userId: number): Promise<Connection[]> {
    return await db
      .select()
      .from(connections)
      .where(and(eq(connections.receiverId, userId), eq(connections.status, "pending")));
  }

  async updateConnection(id: number, updates: Partial<Connection>): Promise<Connection | undefined> {
    const [connection] = await db
      .update(connections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(connections.id, id))
      .returning();
    return connection;
  }

  // Networking profile operations
  async createNetworkingProfile(insertProfile: InsertNetworkingProfile): Promise<NetworkingProfile> {
    const [profile] = await db
      .insert(networkingProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async getNetworkingProfile(userId: number): Promise<NetworkingProfile | undefined> {
    const [profile] = await db.select().from(networkingProfiles).where(eq(networkingProfiles.userId, userId));
    return profile;
  }

  async getNetworkingProfiles(filters?: { stage?: string; industries?: string[]; lookingFor?: string[] }): Promise<NetworkingProfile[]> {
    return await db.select().from(networkingProfiles).where(eq(networkingProfiles.visibility, "public"));
  }

  async updateNetworkingProfile(userId: number, updates: Partial<NetworkingProfile>): Promise<NetworkingProfile | undefined> {
    const [profile] = await db
      .update(networkingProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(networkingProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Waitlist operations
  async createWaitlistEntry(insertEntry: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db
      .insert(waitlist)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async getWaitlistEntry(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry;
  }



  async getWaitlistByGoogleId(googleId: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.googleId, googleId));
    return entry;
  }

  async getWaitlistCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
    return result[0]?.count || 0;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return await db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
  }

  // Startup Profile operations
  async createStartupProfile(insertProfile: InsertStartupProfile): Promise<StartupProfile> {
    const [profile] = await db
      .insert(startupProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async getStartupProfile(userId: number): Promise<StartupProfile | undefined> {
    const [profile] = await db.select().from(startupProfiles).where(eq(startupProfiles.userId, userId));
    return profile;
  }

  async updateStartupProfile(id: number, updates: Partial<StartupProfile>): Promise<StartupProfile | undefined> {
    const [profile] = await db
      .update(startupProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(startupProfiles.id, id))
      .returning();
    return profile;
  }

  // Password reset operations
  async createPasswordResetToken(insertToken: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, token), eq(passwordResetTokens.used, false)));
    return resetToken;
  }

  async markPasswordResetTokenAsUsed(token: string): Promise<boolean> {
    const result = await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(sql`expires_at < now()`);
  }

  // Demo Session operations
  async createDemoSession(insertSession: InsertDemoSession): Promise<DemoSession> {
    const [session] = await db
      .insert(demoSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getDemoSession(sessionId: string): Promise<DemoSession | undefined> {
    const [session] = await db
      .select()
      .from(demoSessions)
      .where(eq(demoSessions.sessionId, sessionId));
    return session || undefined;
  }

  async updateDemoSession(sessionId: string, updates: Partial<DemoSession>): Promise<DemoSession | undefined> {
    const [session] = await db
      .update(demoSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(demoSessions.sessionId, sessionId))
      .returning();
    return session || undefined;
  }

  // Artifact operations
  async createArtifact(insertArtifact: InsertArtifact): Promise<Artifact> {
    const [artifact] = await db
      .insert(artifacts)
      .values(insertArtifact)
      .returning();
    return artifact;
  }

  async getArtifact(id: number): Promise<Artifact | undefined> {
    const [artifact] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id));
    return artifact || undefined;
  }

  async getArtifactsBySession(sessionId: string): Promise<Artifact[]> {
    return await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.sessionId, sessionId))
      .orderBy(desc(artifacts.createdAt));
  }

  async getArtifactByType(sessionId: string, type: string): Promise<Artifact | undefined> {
    const [artifact] = await db
      .select()
      .from(artifacts)
      .where(and(
        eq(artifacts.sessionId, sessionId),
        eq(artifacts.type, type)
      ));
    return artifact || undefined;
  }

  async updateArtifact(id: number, updates: Partial<Artifact>): Promise<Artifact | undefined> {
    const [artifact] = await db
      .update(artifacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(artifacts.id, id))
      .returning();
    return artifact || undefined;
  }

  // Gamification operations
  // User Progress
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    return progress || undefined;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateUserProgress(userId: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [progress] = await db
      .update(userProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return progress || undefined;
  }

  async awardXp(userId: number, xp: number, reason: string): Promise<{ leveledUp: boolean; newLevel?: number }> {
    let progress = await this.getUserProgress(userId);
    
    if (!progress) {
      progress = await this.createUserProgress({ userId, xp, points: xp });
    } else {
      const currentXp = progress.xp ?? 0;
      const currentLevel = progress.level ?? 1;
      const currentPoints = progress.points ?? 0;
      
      const newXp = currentXp + xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      const leveledUp = newLevel > currentLevel;
      const nextLevelXp = newLevel * 100;
      
      await this.updateUserProgress(userId, {
        xp: newXp,
        level: newLevel,
        nextLevelXp,
        points: currentPoints + xp
      });
      
      return { leveledUp, newLevel: leveledUp ? newLevel : undefined };
    }
    
    return { leveledUp: false };
  }

  async updateStreak(userId: number): Promise<UserProgress | undefined> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return undefined;

    // Use UTC for consistent timezone handling
    const nowUtc = new Date();
    const todayUtc = new Date(Date.UTC(
      nowUtc.getUTCFullYear(),
      nowUtc.getUTCMonth(),
      nowUtc.getUTCDate(),
      0, 0, 0, 0
    ));
    
    const lastActive = progress.lastActiveAt ? new Date(progress.lastActiveAt) : null;
    let isConsecutive = false;
    
    if (lastActive) {
      // Convert lastActive to UTC date for comparison
      const lastActiveUtc = new Date(Date.UTC(
        lastActive.getUTCFullYear(),
        lastActive.getUTCMonth(),
        lastActive.getUTCDate(),
        0, 0, 0, 0
      ));
      
      // Calculate difference in days (UTC)
      const dayDifference = Math.floor((todayUtc.getTime() - lastActiveUtc.getTime()) / (24 * 60 * 60 * 1000));
      
      // Consecutive if last active was yesterday (1 day ago)
      isConsecutive = dayDifference === 1;
      
      // If it's the same day, maintain current streak without incrementing
      if (dayDifference === 0) {
        return progress;
      }
    }

    const currentStreak = progress.streakDays ?? 0;
    const newStreak = isConsecutive ? currentStreak + 1 : 1;
    
    return await this.updateUserProgress(userId, {
      streakDays: newStreak,
      lastActiveAt: nowUtc
    });
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges).orderBy(desc(badges.createdAt));
  }

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  async awardBadge(userId: number, badgeId: number): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values({ userId, badgeId })
      .returning();
    return userBadge;
  }

  async checkBadgeEligibility(userId: number): Promise<Badge[]> {
    // Simple implementation - could be enhanced with more complex criteria
    const allBadges = await this.getBadges();
    const userBadgesList = await this.getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadgesList.map(ub => ub.badgeId));
    
    return allBadges.filter(badge => !earnedBadgeIds.has(badge.id));
  }

  // Quests
  async getActiveQuests(): Promise<Quest[]> {
    return await db
      .select()
      .from(quests)
      .where(eq(quests.isActive, true))
      .orderBy(desc(quests.createdAt));
  }

  async getUserQuests(userId: number): Promise<UserQuest[]> {
    return await db
      .select()
      .from(userQuests)
      .where(eq(userQuests.userId, userId))
      .orderBy(desc(userQuests.createdAt));
  }

  async createUserQuest(insertUserQuest: InsertUserQuest): Promise<UserQuest> {
    const [userQuest] = await db
      .insert(userQuests)
      .values(insertUserQuest)
      .returning();
    return userQuest;
  }

  async updateQuestProgress(userId: number, questId: number, progress: number): Promise<UserQuest | undefined> {
    const [userQuest] = await db
      .update(userQuests)
      .set({ 
        progress,
        completed: progress >= 100,
        completedAt: progress >= 100 ? new Date() : null,
        updatedAt: new Date()
      })
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
      .returning();
    return userQuest || undefined;
  }

  async completeQuest(userId: number, questId: number): Promise<UserQuest | undefined> {
    const [userQuest] = await db
      .update(userQuests)
      .set({ 
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
      .returning();
    return userQuest || undefined;
  }

  async claimQuest(userId: number, questId: number): Promise<{ xp: number; points: number }> {
    // Get quest details
    const [quest] = await db
      .select()
      .from(quests)
      .where(eq(quests.id, questId));
    
    if (!quest) throw new Error('Quest not found');

    // Mark as claimed
    await db
      .update(userQuests)
      .set({ 
        claimed: true,
        claimedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)));

    // Award XP
    await this.awardXp(userId, quest.rewardXp, `Completed quest: ${quest.title}`);

    return { xp: quest.rewardXp, points: quest.rewardPoints || 0 };
  }

  async resetUserQuests(userId: number, period: string): Promise<void> {
    await db
      .delete(userQuests)
      .where(and(
        eq(userQuests.userId, userId),
        eq(userQuests.questId, sql`(SELECT id FROM quests WHERE period = ${period})`)
      ));
  }

  // Daily Check-ins
  async hasCheckedInToday(userId: number): Promise<boolean> {
    // Use UTC for consistent timezone handling
    const nowUtc = new Date();
    const todayUtc = new Date(Date.UTC(
      nowUtc.getUTCFullYear(),
      nowUtc.getUTCMonth(),
      nowUtc.getUTCDate(),
      0, 0, 0, 0
    ));
    
    const tomorrowUtc = new Date(todayUtc.getTime() + 24 * 60 * 60 * 1000);
    
    const [checkin] = await db
      .select()
      .from(dailyCheckins)
      .where(and(
        eq(dailyCheckins.userId, userId),
        sql`${dailyCheckins.checkinDate} AT TIME ZONE 'UTC' >= ${todayUtc.toISOString()}`,
        sql`${dailyCheckins.checkinDate} AT TIME ZONE 'UTC' < ${tomorrowUtc.toISOString()}`
      ))
      .limit(1);
    
    return !!checkin;
  }

  async performDailyCheckin(userId: number, mood?: string, note?: string): Promise<{ xp: number; bonusXp: number; streakDay: number; leveledUp: boolean; newLevel?: number }> {
    return await db.transaction(async (tx) => {
      // Check if already checked in today (within transaction)
      const alreadyCheckedIn = await this.hasCheckedInToday(userId);
      if (alreadyCheckedIn) {
        const error = new Error('Already checked in today');
        (error as any).code = 'DUPLICATE_CHECKIN';
        throw error;
      }

      // Update streak and get current streak
      const progress = await this.updateStreak(userId);
      const currentStreak = progress?.streakDays ?? 1;

      // Calculate bonus XP for streak milestones
      let bonusXp = 0;
      if (currentStreak % 30 === 0) bonusXp = 500; // Monthly bonus (highest priority)
      else if (currentStreak % 7 === 0) bonusXp = 100; // Weekly bonus
      else if (currentStreak === 10) bonusXp = 150; // 10-day milestone
      else if (currentStreak === 3) bonusXp = 25; // First 3-day streak

      const baseXp = 50;
      const totalXp = baseXp + bonusXp;

      try {
        // Record the check-in (atomic within transaction)
        const [checkin] = await tx
          .insert(dailyCheckins)
          .values({
            userId,
            xpAwarded: baseXp,
            streakDay: currentStreak,
            bonusXp,
            mood: mood || null,
            note: note || null,
          })
          .returning();

        // Award XP (atomic within transaction)
        const xpResult = await this.awardXp(userId, totalXp, 'Daily check-in');

        return {
          xp: baseXp,
          bonusXp,
          streakDay: currentStreak,
          leveledUp: xpResult.leveledUp,
          newLevel: xpResult.newLevel
        };
      } catch (error: any) {
        // Handle unique constraint violation from schema
        if (error.code === '23505' && error.constraint?.includes('unique_user_date')) {
          const duplicateError = new Error('Already checked in today');
          (duplicateError as any).code = 'DUPLICATE_CHECKIN';
          throw duplicateError;
        }
        throw error;
      }
    });
  }

  async getDailyCheckinHistory(userId: number, limit: number = 30): Promise<DailyCheckin[]> {
    return await db
      .select()
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, userId))
      .orderBy(desc(dailyCheckins.checkinDate))
      .limit(limit);
  }

  async getDailyCheckinStats(userId: number): Promise<{
    totalCheckins: number;
    currentStreak: number;
    longestStreak: number;
    totalXpFromCheckins: number;
  }> {
    // Get total check-ins
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, userId));
    
    const totalCheckins = Number(totalResult[0]?.count ?? 0);

    // Get current streak from user progress
    const progress = await this.getUserProgress(userId);
    const currentStreak = progress?.streakDays ?? 0;

    // Calculate longest streak from check-in history
    const checkins = await this.getDailyCheckinHistory(userId, 365);
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < checkins.length; i++) {
      if (i === 0) {
        tempStreak = checkins[i].streakDay ?? 1;
      } else {
        const current = new Date(checkins[i].checkinDate!);
        const previous = new Date(checkins[i - 1].checkinDate!);
        const dayDiff = Math.abs(current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff <= 1) {
          tempStreak = Math.max(tempStreak, checkins[i].streakDay ?? 1);
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = checkins[i].streakDay ?? 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate total XP from check-ins
    const xpResult = await db
      .select({ 
        totalXp: sql<number>`sum(${dailyCheckins.xpAwarded} + ${dailyCheckins.bonusXp})`
      })
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, userId));
    
    const totalXpFromCheckins = Number(xpResult[0]?.totalXp ?? 0);

    return {
      totalCheckins,
      currentStreak,
      longestStreak,
      totalXpFromCheckins
    };
  }

  // Credit operations
  async getUserCredits(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user?.credits ?? 0;
  }

  async addCredits(userId: number, amount: number, description: string, paymentDetails?: Partial<CreditTransaction>): Promise<CreditTransaction> {
    // Get current user credits
    const currentCredits = await this.getUserCredits(userId);
    const newBalance = currentCredits + amount;

    // Update user credits
    await db.update(users)
      .set({ credits: newBalance })
      .where(eq(users.id, userId));

    // Create transaction record
    const [transaction] = await db.insert(creditTransactions)
      .values({
        userId,
        type: 'purchase',
        amount,
        balance: newBalance,
        description,
        ...paymentDetails,
      })
      .returning();

    return transaction;
  }

  async deductCredits(userId: number, amount: number, description: string, featureUsed?: string, relatedIdeaId?: number): Promise<CreditTransaction> {
    // Get current user credits
    const currentCredits = await this.getUserCredits(userId);
    
    if (currentCredits < amount) {
      throw new Error(`Insufficient credits. You have ${currentCredits} credits but need ${amount}.`);
    }

    const newBalance = currentCredits - amount;

    // Update user credits
    await db.update(users)
      .set({ credits: newBalance })
      .where(eq(users.id, userId));

    // Create transaction record
    const [transaction] = await db.insert(creditTransactions)
      .values({
        userId,
        type: 'usage',
        amount: -amount, // Negative for deductions
        balance: newBalance,
        description,
        featureUsed,
        relatedIdeaId,
      })
      .returning();

    return transaction;
  }

  async getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]> {
    const query = db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));

    if (limit) {
      return await query.limit(limit);
    }

    return await query;
  }

  async getCreditTransaction(id: number): Promise<CreditTransaction | undefined> {
    const [transaction] = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.id, id));
    return transaction || undefined;
  }

  async getCreditTransactionBySignature(signature: string): Promise<CreditTransaction | undefined> {
    const [transaction] = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.transactionHash, signature));
    return transaction || undefined;
  }

  async getCreditBalance(userId: number): Promise<{ credits: number; transactions: CreditTransaction[] }> {
    const credits = await this.getUserCredits(userId);
    const transactions = await this.getCreditTransactions(userId, 10); // Last 10 transactions
    return { credits, transactions };
  }
}

export const storage = new DatabaseStorage();

// Sample gamification data seeding
export async function seedGamificationData() {
  try {
    // Check if badges already exist
    const existingBadges = await storage.getBadges();
    
    if (existingBadges.length === 0) {
      console.log("🎮 Seeding badges...");
      
      // Sample badges
      const badgesToSeed = [
        {
          name: "First Idea",
          icon: "lightbulb",
          description: "Submit your first startup idea",
          rarity: "common",
          criteria: "Submit at least 1 startup idea"
        },
        {
          name: "Rising Star", 
          icon: "star",
          description: "Reach level 5",
          rarity: "rare",
          criteria: "Reach user level 5"
        },
        {
          name: "Business Planner",
          icon: "fileText",
          description: "Generate 3 business plans",
          rarity: "rare", 
          criteria: "Generate 3 or more business plans"
        },
        {
          name: "Pitch Master",
          icon: "presentation",
          description: "Create 5 pitch decks",
          rarity: "epic",
          criteria: "Generate 5 or more pitch decks"
        },
        {
          name: "Streak Master",
          icon: "flame",
          description: "Maintain a 7-day login streak",
          rarity: "epic",
          criteria: "Login for 7 consecutive days"
        },
        {
          name: "Entrepreneur",
          icon: "trophy",
          description: "Reach level 10",
          rarity: "legendary",
          criteria: "Reach user level 10"
        }
      ];

      for (const badge of badgesToSeed) {
        await db.insert(badges).values(badge);
      }
      console.log(`✅ Seeded ${badgesToSeed.length} badges`);
    }

    // Check if quests already exist
    const existingQuests = await storage.getActiveQuests();
    
    if (existingQuests.length === 0) {
      console.log("🎯 Seeding quests...");
      
      // Sample quests
      const questsToSeed = [
        {
          title: "Daily Login",
          description: "Login to your account",
          period: "daily",
          target: 1,
          metric: "daily_login",
          rewardXp: 10,
          rewardPoints: 5,
          isActive: true
        },
        {
          title: "Submit an Idea", 
          description: "Share your startup idea with the community",
          period: "daily",
          target: 1,
          metric: "idea_submitted",
          rewardXp: 50,
          rewardPoints: 25,
          isActive: true
        },
        {
          title: "Complete Profile",
          description: "Fill out your startup profile",
          period: "weekly",
          target: 1, 
          metric: "profile_completed",
          rewardXp: 25,
          rewardPoints: 15,
          isActive: true
        },
        {
          title: "Business Plan Creator",
          description: "Generate 2 business plans this week",
          period: "weekly",
          target: 2,
          metric: "business_plan_generated", 
          rewardXp: 100,
          rewardPoints: 50,
          isActive: true
        },
        {
          title: "Pitch Perfect",
          description: "Create a pitch deck",
          period: "weekly",
          target: 1,
          metric: "pitch_deck_generated",
          rewardXp: 75,
          rewardPoints: 40,
          isActive: true
        }
      ];

      for (const quest of questsToSeed) {
        await db.insert(quests).values(quest);
      }
      console.log(`✅ Seeded ${questsToSeed.length} quests`);
    }

    console.log("🎮 Gamification data seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding gamification data:", error);
  }
}

// Auto-seed data on startup (for development)
if (process.env.NODE_ENV !== 'production') {
  setTimeout(() => {
    seedGamificationData().catch(console.error);
  }, 1000); // Wait 1 second for DB connection
}
