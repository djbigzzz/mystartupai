import { apiRequest } from "./queryClient";
import type { InsertStartupIdea, StartupIdea, InsertCompany, Company, InsertDocument, Document } from "@shared/schema";

export const api = {
  // Startup Ideas
  async submitIdea(idea: InsertStartupIdea): Promise<StartupIdea> {
    return await apiRequest("/api/ideas", { method: "POST", body: idea });
  },

  async getIdea(id: number): Promise<StartupIdea> {
    return await apiRequest(`/api/ideas/${id}`);
  },

  async getIdeasByEmail(email: string): Promise<StartupIdea[]> {
    return await apiRequest(`/api/ideas?email=${encodeURIComponent(email)}`);
  },

  async generateBusinessPlan(id: number): Promise<StartupIdea> {
    return await apiRequest(`/api/ideas/${id}/business-plan`, { method: "POST" });
  },

  async generatePitchDeck(id: number): Promise<StartupIdea> {
    return await apiRequest(`/api/ideas/${id}/pitch-deck`, { method: "POST" });
  },

  // Companies
  async createCompany(company: InsertCompany & { userId?: number }): Promise<Company> {
    return await apiRequest("/api/companies", { method: "POST", body: company });
  },

  async getCompany(id: number): Promise<Company> {
    return await apiRequest(`/api/companies/${id}`);
  },

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company> {
    return await apiRequest(`/api/companies/${id}`, { method: "PUT", body: updates });
  },

  // Documents
  async createDocument(companyId: number, document: Omit<InsertDocument, 'companyId'>): Promise<Document> {
    return await apiRequest(`/api/companies/${companyId}/documents`, { method: "POST", body: document });
  },

  async getCompanyDocuments(companyId: number): Promise<Document[]> {
    return await apiRequest(`/api/companies/${companyId}/documents`);
  },

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document> {
    return await apiRequest(`/api/documents/${id}`, { method: "PUT", body: updates });
  },

  async deleteDocument(id: number): Promise<{ message: string }> {
    return await apiRequest(`/api/documents/${id}`, { method: "DELETE" });
  },
};
