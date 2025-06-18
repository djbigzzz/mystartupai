import { apiRequest } from "./queryClient";
import type { InsertStartupIdea, StartupIdea, InsertCompany, Company, InsertDocument, Document } from "@shared/schema";

export const api = {
  // Startup Ideas
  async submitIdea(idea: InsertStartupIdea): Promise<StartupIdea> {
    const response = await apiRequest("POST", "/api/ideas", idea);
    return response.json();
  },

  async getIdea(id: number): Promise<StartupIdea> {
    const response = await apiRequest("GET", `/api/ideas/${id}`);
    return response.json();
  },

  async getIdeasByEmail(email: string): Promise<StartupIdea[]> {
    const response = await apiRequest("GET", `/api/ideas?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  async generateBusinessPlan(id: number): Promise<StartupIdea> {
    const response = await apiRequest("POST", `/api/ideas/${id}/business-plan`);
    return response.json();
  },

  async generatePitchDeck(id: number): Promise<StartupIdea> {
    const response = await apiRequest("POST", `/api/ideas/${id}/pitch-deck`);
    return response.json();
  },

  // Companies
  async createCompany(company: InsertCompany & { userId?: number }): Promise<Company> {
    const response = await apiRequest("POST", "/api/companies", company);
    return response.json();
  },

  async getCompany(id: number): Promise<Company> {
    const response = await apiRequest("GET", `/api/companies/${id}`);
    return response.json();
  },

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company> {
    const response = await apiRequest("PUT", `/api/companies/${id}`, updates);
    return response.json();
  },

  // Documents
  async createDocument(companyId: number, document: Omit<InsertDocument, 'companyId'>): Promise<Document> {
    const response = await apiRequest("POST", `/api/companies/${companyId}/documents`, document);
    return response.json();
  },

  async getCompanyDocuments(companyId: number): Promise<Document[]> {
    const response = await apiRequest("GET", `/api/companies/${companyId}/documents`);
    return response.json();
  },

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document> {
    const response = await apiRequest("PUT", `/api/documents/${id}`, updates);
    return response.json();
  },

  async deleteDocument(id: number): Promise<{ message: string }> {
    const response = await apiRequest("DELETE", `/api/documents/${id}`);
    return response.json();
  },
};
