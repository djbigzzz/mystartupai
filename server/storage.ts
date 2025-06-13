import { users, startupIdeas, type User, type InsertUser, type StartupIdea, type InsertStartupIdea } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea>;
  getStartupIdea(id: number): Promise<StartupIdea | undefined>;
  updateStartupIdea(id: number, updates: Partial<StartupIdea>): Promise<StartupIdea | undefined>;
  getStartupIdeasByEmail(email: string): Promise<StartupIdea[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private startupIdeas: Map<number, StartupIdea>;
  private currentUserId: number;
  private currentIdeaId: number;

  constructor() {
    this.users = new Map();
    this.startupIdeas = new Map();
    this.currentUserId = 1;
    this.currentIdeaId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createStartupIdea(insertIdea: InsertStartupIdea): Promise<StartupIdea> {
    const id = this.currentIdeaId++;
    const idea: StartupIdea = { 
      ...insertIdea, 
      id,
      analysis: null,
      businessPlan: null,
      pitchDeck: null,
      createdAt: new Date()
    };
    this.startupIdeas.set(id, idea);
    return idea;
  }

  async getStartupIdea(id: number): Promise<StartupIdea | undefined> {
    return this.startupIdeas.get(id);
  }

  async updateStartupIdea(id: number, updates: Partial<StartupIdea>): Promise<StartupIdea | undefined> {
    const existing = this.startupIdeas.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.startupIdeas.set(id, updated);
    return updated;
  }

  async getStartupIdeasByEmail(email: string): Promise<StartupIdea[]> {
    return Array.from(this.startupIdeas.values()).filter(
      (idea) => idea.email === email
    );
  }
}

export const storage = new MemStorage();
