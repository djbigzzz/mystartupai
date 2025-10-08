import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { log } from "./vite";

/**
 * Seed test users for development/testing environments
 */
export async function seedTestUsers() {
  // Only seed in development/test environments
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  try {
    // Check if web3user already exists
    const existingUser = await storage.getUserByEmail("web3user@test.com");
    
    if (!existingUser) {
      log("Seeding test user: web3user@test.com");
      
      // Hash the password
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      // Create test user with CORE plan and 6,200 credits
      const testUser = await storage.createUser({
        email: "web3user@test.com",
        name: "Web3 Test User",
        username: "web3user",
        password: hashedPassword,
        authMethod: "email",
        credits: 6200,
        currentPlan: "CORE",
        subscriptionStatus: "active",
        subscriptionStartDate: new Date(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      
      log(`✅ Test user created: ${testUser.email} (ID: ${testUser.id})`);
      log(`   Plan: ${testUser.currentPlan}, Credits: ${testUser.credits}`);
    } else {
      log(`Test user already exists: ${existingUser.email}`);
    }
  } catch (error) {
    console.error("Error seeding test users:", error);
  }
}
