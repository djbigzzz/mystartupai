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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;

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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
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
}

export const storage = new DatabaseStorage();
