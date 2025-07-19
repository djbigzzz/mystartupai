# IMMEDIATE GOOGLE OAUTH FIX - Follow These Steps

## Step 1: Open Google Cloud Console
**Click this link**: https://console.cloud.google.com

## Step 2: Find Your OAuth Settings
1. Select your project from the dropdown at the top
2. In the left menu, click: **APIs & Services** → **Credentials**
3. Look for "OAuth 2.0 Client IDs" in the list
4. Click the **pencil/edit icon** next to your OAuth client

## Step 3: Add These Exact URLs
In the "Authorized redirect URIs" section:

**Click "ADD URI" and paste this exactly:**
```
https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback
```

**Click "ADD URI" again and paste this exactly:**
```
https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/waitlist/callback
```

## Step 4: Save
Click **"SAVE"** at the bottom of the page

## Step 5: Wait
Wait 5-10 minutes for Google to update globally

## Step 6: Test
Go back to your app and try "Continue with Google" - it should work!

---

**COPY THESE URLS EXACTLY (no typos):**
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback`
- `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/waitlist/callback`