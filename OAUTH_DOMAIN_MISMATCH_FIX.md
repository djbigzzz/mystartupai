# OAuth Domain Mismatch - Quick Fix

## Issue Identified
The redirect URIs in Google Cloud Console don't match the current domain format.

**Google Console has:**
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/manual/callback`

**Current Domain Needs:**
- Need to verify exact current domain format

## Solution Options

### Option 1: Update Google Cloud Console (Recommended)
Remove the old URLs and add the correct current domain

### Option 2: Use Environment Variable for Consistent Domain
Set REPLIT_DOMAINS or similar to ensure consistent domain usage

### Option 3: Dynamic Domain Detection
Improve the domain detection in our OAuth implementation

Let me verify the exact current domain and fix this immediately.