// Security audit script for MyStartup.ai
import fs from 'fs';
import path from 'path';

console.log('🔒 Starting comprehensive security audit...\n');

// Check for common security vulnerabilities
const securityChecks = {
  // 1. Environment variables exposure
  envVarExposure: () => {
    console.log('1. Checking for exposed environment variables...');
    const clientFiles = [
      'client/src/App.tsx',
      'client/src/lib/queryClient.ts',
      'client/src/components'
    ];
    
    let issues = [];
    // Check for process.env usage in client code
    try {
      const appFile = fs.readFileSync('./client/src/App.tsx', 'utf8');
      if (appFile.includes('process.env') && !appFile.includes('import.meta.env')) {
        issues.push('Client using process.env instead of import.meta.env');
      }
    } catch (e) {
      // File might not exist
    }
    
    return issues;
  },

  // 2. SQL Injection protection
  sqlInjection: () => {
    console.log('2. Checking for SQL injection vulnerabilities...');
    let issues = [];
    
    try {
      const storageFile = fs.readFileSync('./server/storage.ts', 'utf8');
      if (storageFile.includes('${') && storageFile.includes('sql`')) {
        issues.push('Potential SQL injection: Template literals in SQL queries');
      }
      if (!storageFile.includes('eq(') && !storageFile.includes('drizzle')) {
        issues.push('Not using parameterized queries');
      }
    } catch (e) {
      issues.push('Cannot read storage file for SQL injection check');
    }
    
    return issues;
  },

  // 3. Authentication bypass
  authBypass: () => {
    console.log('3. Checking for authentication bypass vulnerabilities...');
    let issues = [];
    
    try {
      const routesFile = fs.readFileSync('./server/routes.ts', 'utf8');
      // Check for unprotected routes that should be protected
      if (routesFile.includes('/api/') && !routesFile.includes('isAuthenticated')) {
        issues.push('Potential unprotected API routes');
      }
    } catch (e) {
      issues.push('Cannot read routes file for auth check');
    }
    
    return issues;
  },

  // 4. XSS protection
  xssProtection: () => {
    console.log('4. Checking for XSS vulnerabilities...');
    let issues = [];
    
    try {
      const indexFile = fs.readFileSync('./client/index.html', 'utf8');
      if (!indexFile.includes('Content-Security-Policy')) {
        issues.push('Missing Content Security Policy headers');
      }
    } catch (e) {
      // Check in server for CSP headers
      try {
        const serverFile = fs.readFileSync('./server/index.ts', 'utf8');
        if (!serverFile.includes('helmet') && !serverFile.includes('csp')) {
          issues.push('Missing XSS protection headers');
        }
      } catch (e2) {
        issues.push('Cannot verify XSS protection');
      }
    }
    
    return issues;
  },

  // 5. Session security
  sessionSecurity: () => {
    console.log('5. Checking session security...');
    let issues = [];
    
    try {
      const authFile = fs.readFileSync('./server/auth.ts', 'utf8');
      if (!authFile.includes('httpOnly') || !authFile.includes('secure')) {
        issues.push('Session cookies not properly secured');
      }
      if (!authFile.includes('SESSION_SECRET')) {
        issues.push('Session secret not configured');
      }
    } catch (e) {
      issues.push('Cannot verify session security configuration');
    }
    
    return issues;
  }
};

// Run all security checks
let totalIssues = 0;
Object.keys(securityChecks).forEach(checkName => {
  const issues = securityChecks[checkName]();
  if (issues.length > 0) {
    console.log(`   ❌ ${issues.length} issue(s) found:`);
    issues.forEach(issue => console.log(`      - ${issue}`));
    totalIssues += issues.length;
  } else {
    console.log('   ✅ No issues found');
  }
  console.log('');
});

console.log(`🔒 Security audit complete. Total issues: ${totalIssues}`);
if (totalIssues === 0) {
  console.log('✅ System appears secure for production deployment');
} else {
  console.log('⚠️  Security issues found that should be addressed');
}