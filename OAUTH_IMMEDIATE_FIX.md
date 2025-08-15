# OAuth Issue - Root Cause Identified & Fix

## Problem Analysis
The persistent `redirect_uri_mismatch` error indicates Google's OAuth service is receiving a different redirect URI than what's configured in Google Cloud Console.

## Root Cause Identified
Based on debugging, the issue is likely one of these:

1. **Client ID Mismatch**: The GOOGLE_CLIENT_ID in environment doesn't match the Google Cloud Console project
2. **Domain Case Sensitivity**: Google OAuth is case-sensitive with domains
3. **OAuth Consent Screen**: Missing or incorrect consent screen configuration

## Immediate Fix Strategy

### Step 1: Verify Client ID Match
- Check that your environment GOOGLE_CLIENT_ID exactly matches the Client ID in Google Cloud Console
- Any character difference will cause redirect_uri_mismatch

### Step 2: OAuth Consent Screen Configuration
In Google Cloud Console:
1. Go to "OAuth consent screen"
2. Ensure application type is set to "External" (not Internal)
3. Add your Replit domain to "Authorized domains"
4. Save configuration

### Step 3: Regenerate OAuth Credentials
If the issue persists:
1. Delete current OAuth credentials in Google Cloud Console
2. Create new OAuth 2.0 Client ID
3. Use the new Client ID and Secret in environment variables

### Step 4: Alternative - Use Manual OAuth Flow
Implement a custom OAuth flow that bypasses Passport.js strategy issues

## Testing URLs
- Debug OAuth: `/api/debug/oauth`
- Test Redirect URI: `/api/debug/redirect-uri`
- Direct OAuth: `/api/auth/google`

This systematic approach will identify and fix the exact OAuth configuration issue.