import { apiRequest } from "./queryClient";
import type { InsertStartupIdea, StartupIdea } from "@shared/schema";

export const api = {
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
  }
};
