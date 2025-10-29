# Google Console Configuration Check

## Current OAuth Configuration
- **Callback URL**: `https://mystartup.ai/api/auth/google/manual/callback`
- **Status**: Fixed in code ✅

## Required Google Console Settings

You need to verify these settings in your Google Cloud Console:

### 1. OAuth 2.0 Client Settings
**Location**: Google Cloud Console → APIs & Services → Credentials

**Required Authorized Redirect URIs**:
```
https://mystartup.ai/api/auth/google/manual/callback
```

**Optional Additional URIs** (if you want both strategies):
```
https://mystartup.ai/api/auth/google/callback
https://mystartup.ai/api/auth/google/waitlist/callback
```

### 2. OAuth Consent Screen
**Location**: Google Cloud Console → APIs & Services → OAuth consent screen

**Required Settings**:
- **Application name**: MyStartup.ai (or your preferred name)
- **Authorized domains**: `mystartup.ai`
- **Application homepage**: `https://mystartup.ai`
- **Application privacy policy**: `https://mystartup.ai/privacy` (if exists)
- **Application terms of service**: `https://mystartup.ai/terms` (if exists)

### 3. Scopes Required
- `../auth/userinfo.email`
- `../auth/userinfo.profile`

## Steps to Fix 404 Error

1. **Go to Google Cloud Console**
2. **Navigate to**: APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID**: `1046404669539-cedhc7dk9k54ijhtcfl67kj5g1o2ciek.apps.googleusercontent.com`
4. **Click Edit**
5. **Add to Authorized redirect URIs**:
   ```
   https://mystartup.ai/api/auth/google/manual/callback
   ```
6. **Save changes**
7. **Test OAuth again**

## Current Test URL
The OAuth now correctly generates:
```
https://accounts.google.com/oauth/authorize?redirect_uri=https%3A%2F%2Fmystartup.ai%2Fapi%2Fauth%2Fgoogle%2Fmanual%2Fcallback
```

Once you update the Google Console settings, the OAuth will work perfectly.