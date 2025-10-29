# Google OAuth Setup Guide - MyStartup.ai

## Current OAuth Configuration Issue

The error `redirect_uri_mismatch` occurs because the Google OAuth redirect URI in Google Cloud Console doesn't match the current application domain.

**Current Configuration:**
- Expected URI: `https://your-replit-domain.replit.app/api/auth/google/callback`
- Registered URI in Google Console: Different domain (likely `https://mystartup.ai/api/auth/google/callback`)

## Quick Fix Options

### Option 1: Update Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add the current Replit domain to **Authorized redirect URIs**:
   ```
   https://your-actual-replit-domain.replit.app/api/auth/google/callback
   ```

### Option 2: Disable Google OAuth Temporarily

If you want to proceed without Google OAuth for now:

1. **Remove Google OAuth Buttons**: Comment out Google auth buttons in the frontend
2. **Use Email/Password Only**: The platform works fully with email/password authentication
3. **Re-enable Later**: Add Google OAuth back when domain is configured

## Technical Implementation

The application now dynamically generates the callback URL based on the current domain:

```javascript
// Dynamic callback URL generation
const getCallbackURL = () => {
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    return `https://${domain}/api/auth/google/callback`;
  }
  return "http://localhost:5000/api/auth/google/callback";
};
```

## Current Domain Detection

To find your current domain:

1. Check the browser URL when accessing the app
2. Look at `process.env.REPLIT_DOMAINS` in the environment
3. Use the domain shown in Replit's webview

## Authentication Alternatives

The platform supports multiple authentication methods:

✅ **Email/Password Authentication** - Fully functional  
✅ **User Registration** - Working with validation  
✅ **Session Management** - Secure session-based auth  
❌ **Google OAuth** - Needs domain configuration  

## Recommended Action

**For immediate deployment**: Proceed with email/password authentication only. Google OAuth can be configured later with the correct production domain.

**For full OAuth support**: Update the Google Cloud Console with the actual Replit domain URL.

## Testing Authentication

You can test the working authentication methods:

```bash
# Test registration
curl -X POST https://your-domain.replit.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"securePassword123!"}'

# Test login  
curl -X POST https://your-domain.replit.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"securePassword123!"}'
```

The platform is fully functional without Google OAuth and ready for production deployment.