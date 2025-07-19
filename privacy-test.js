/**
 * Privacy Protection Test Suite
 * Verifies no sensitive user data is exposed in API responses or logs
 */

import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

class PrivacyTester {
  constructor() {
    this.testResults = [];
    this.sensitiveFields = [
      'password',
      'passwordHash',
      'hashedPassword',
      'token',
      'secret',
      'key',
      'hash',
      'ssn',
      'social_security',
      'credit_card',
      'session'
    ];
  }

  log(message) {
    console.log(`🔒 ${message}`);
    this.testResults.push(message);
  }

  checkForSensitiveData(data, context) {
    if (!data || typeof data !== 'object') return false;
    
    const dataStr = JSON.stringify(data).toLowerCase();
    const foundSensitive = [];
    
    this.sensitiveFields.forEach(field => {
      if (dataStr.includes(field.toLowerCase())) {
        foundSensitive.push(field);
      }
    });
    
    if (foundSensitive.length > 0) {
      this.log(`❌ PRIVACY VIOLATION in ${context}: Found sensitive fields: ${foundSensitive.join(', ')}`);
      return true;
    }
    
    return false;
  }

  async testAuthEndpoints() {
    this.log('Testing authentication endpoints for data exposure...');
    
    // Test registration endpoint
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        email: 'test@example.com',
        name: 'Test User',
        password: 'TestPassword123!'
      });
      
      if (!this.checkForSensitiveData(response.data, 'Registration Response')) {
        this.log('✅ Registration endpoint: No sensitive data exposed');
      }
    } catch (error) {
      this.log(`Registration test: ${error.response?.status} - ${error.response?.statusText}`);
      this.checkForSensitiveData(error.response?.data, 'Registration Error');
    }
    
    // Test login endpoint with invalid credentials
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (!this.checkForSensitiveData(error.response?.data, 'Login Error Response')) {
        this.log('✅ Login endpoint: No sensitive data exposed in errors');
      }
    }
    
    // Test me endpoint without authentication
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`);
    } catch (error) {
      if (!this.checkForSensitiveData(error.response?.data, 'Auth Check Response')) {
        this.log('✅ Auth check endpoint: No sensitive data exposed');
      }
    }
  }

  async testIdeaEndpoints() {
    this.log('Testing idea submission endpoints...');
    
    // Test idea submission without auth
    try {
      const response = await axios.post(`${BASE_URL}/api/ideas`, {
        ideaTitle: 'Test Idea',
        description: 'Test description',
        industry: 'Tech',
        targetMarket: 'Developers',
        stage: 'idea'
      });
    } catch (error) {
      if (!this.checkForSensitiveData(error.response?.data, 'Idea Submission Response')) {
        this.log('✅ Idea submission: No sensitive data exposed');
      }
    }
  }

  async testWaitlistEndpoints() {
    this.log('Testing waitlist endpoints...');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/waitlist`, {
        email: 'privacy-test@example.com',
        name: 'Privacy Test User'
      });
      
      if (!this.checkForSensitiveData(response.data, 'Waitlist Response')) {
        this.log('✅ Waitlist endpoint: No sensitive data exposed');
      }
    } catch (error) {
      this.checkForSensitiveData(error.response?.data, 'Waitlist Error');
    }
  }

  async testProtectedEndpoints() {
    this.log('Testing protected endpoints without authentication...');
    
    const protectedEndpoints = [
      '/api/ideas/1',
      '/api/business-plans/1',
      '/api/pitch-decks/1',
      '/api/startup-profile'
    ];
    
    for (const endpoint of protectedEndpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
      } catch (error) {
        if (error.response?.status === 401) {
          if (!this.checkForSensitiveData(error.response?.data, `Protected endpoint ${endpoint}`)) {
            this.log(`✅ ${endpoint}: Properly protected, no data leak`);
          }
        } else {
          this.log(`❓ ${endpoint}: Unexpected response ${error.response?.status}`);
        }
      }
    }
  }

  async testSQLInjectionDataLeaks() {
    this.log('Testing for SQL injection data leaks...');
    
    const sqlPayloads = [
      "'; SELECT * FROM users; --",
      "' UNION SELECT email,password FROM users --",
      "'; DROP TABLE users; --"
    ];
    
    for (const payload of sqlPayloads) {
      try {
        const response = await axios.post(`${BASE_URL}/api/ideas`, {
          ideaTitle: payload,
          description: 'test',
          industry: 'tech',
          targetMarket: 'test',
          stage: 'idea'
        });
      } catch (error) {
        if (!this.checkForSensitiveData(error.response?.data, 'SQL Injection Response')) {
          this.log('✅ SQL injection attempt blocked, no data leaked');
        }
      }
    }
  }

  async runAllTests() {
    console.log('🔒 PRIVACY PROTECTION TEST SUITE');
    console.log('=================================');
    
    await this.testAuthEndpoints();
    await this.testIdeaEndpoints();
    await this.testWaitlistEndpoints();
    await this.testProtectedEndpoints();
    await this.testSQLInjectionDataLeaks();
    
    console.log('\n📊 PRIVACY TEST RESULTS');
    console.log('========================');
    
    const violations = this.testResults.filter(result => result.includes('❌'));
    const passes = this.testResults.filter(result => result.includes('✅'));
    
    console.log(`✅ Tests Passed: ${passes.length}`);
    console.log(`❌ Privacy Violations: ${violations.length}`);
    
    if (violations.length === 0) {
      console.log('\n🎉 ALL PRIVACY TESTS PASSED!');
      console.log('No sensitive user data exposed in API responses.');
    } else {
      console.log('\n⚠️  PRIVACY VIOLATIONS FOUND:');
      violations.forEach(violation => console.log(violation));
    }
    
    return violations.length === 0;
  }
}

// Run the tests
const tester = new PrivacyTester();
tester.runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Privacy test error:', error.message);
  process.exit(1);
});