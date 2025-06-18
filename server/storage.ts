import { 
  users, 
  startupIdeas, 
  companies, 
  documents,
  type User, 
  type InsertUser, 
  type StartupIdea, 
  type InsertStartupIdea,
  type Company,
  type InsertCompany,
  type Document,
  type InsertDocument
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
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
      .values(insertIdea)
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
    return result.rowCount! > 0;
  }
}

export const storage = new DatabaseStorage();
