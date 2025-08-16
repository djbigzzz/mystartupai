# OAuth 404 Error Fix - Google Cloud Console Configuration

## Problem
Getting 404 error: "The requested URL was not found on this server" when trying to authenticate with Google OAuth.

**Error URL:** `https://accounts.google.com/oauth/authorize?client_id=1046404669539-cedhc7dk9k54ijhtcfl67kj5g1o2ciek.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmystartup.ai%2Fapi%2Fauth%2Fgoogle%2Fmanual%2Fcallback...`

## Root Cause
The redirect URI `https://mystartup.ai/api/auth/google/manual/callback` is not properly configured in your Google Cloud Console.

## Required Fix: Update Google Cloud Console

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with Client ID: `1046404669539-cedhc7dk9k54ijhtcfl67kj5g1o2ciek.apps.googleusercontent.com`)

### Step 2: Navigate to OAuth Settings
1. Go to "APIs & Services" → "Credentials"
2. Find your OAuth 2.0 Client ID: `1046404669539-cedhc7dk9k54ijhtcfl67kj5g1o2ciek.apps.googleusercontent.com`
3. Click on it to edit

### Step 3: Add Authorized Redirect URIs
Add these exact URIs to your "Authorized redirect URIs" list:

**Production URLs:**
- `https://mystartup.ai/api/auth/google/callback`
- `https://mystartup.ai/api/auth/google/manual/callback`
- `https://mystartup.ai/api/auth/google/waitlist/callback`

**Development URLs (for testing):**
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback`
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/manual/callback`
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/waitlist/callback`

### Step 4: Save Changes
1. Click "Save" in Google Cloud Console
2. Wait 5-10 minutes for changes to propagate

## Current OAuth Endpoints in Your App

Your application supports these OAuth flows:

1. **Standard OAuth** (Passport.js): `/api/auth/google` → `/api/auth/google/callback`
2. **Manual OAuth** (Direct API): `/api/auth/google/manual` → `/api/auth/google/manual/callback`
3. **Waitlist OAuth**: `/api/auth/google/waitlist` → `/api/auth/google/waitlist/callback`

## Test After Fixing

After updating Google Cloud Console, test these URLs:

1. **Manual OAuth** (currently broken): https://mystartup.ai/api/auth/google/manual
2. **Standard OAuth**: https://mystartup.ai/api/auth/google
3. **Waitlist OAuth**: https://mystartup.ai/api/auth/google/waitlist

## Important Notes

- The error is **NOT in your code** - it's a Google Cloud Console configuration issue
- Google needs to know exactly which URLs are allowed for OAuth redirects
- After adding the URLs, it may take a few minutes for changes to take effect
- Always use HTTPS in production (HTTP will be rejected by Google)

## Quick Verification

Once fixed, the OAuth flow should work like this:
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth page
3. User authorizes your app
4. Google redirects back to your app with auth code
5. Your app exchanges code for user info
6. User is logged in successfully

The 404 error means Google doesn't recognize your redirect URI as authorized.