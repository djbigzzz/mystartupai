# 🔧 Google OAuth Configuration Fix - Step by Step

## Step 1: Get Your Current Domain
Your current Replit domain is:
```
https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev
```

## Step 2: Update Google Cloud Console

### 2.1 Access Google Cloud Console
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Select your project (the one where you created the OAuth credentials)

### 2.2 Navigate to OAuth Credentials
1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"**
3. Find your OAuth 2.0 Client ID in the list
4. Click the **pencil icon** (edit) next to it

### 2.3 Add the New Redirect URI
1. Scroll down to **"Authorized redirect URIs"**
2. Click **"ADD URI"**
3. Enter this exact URL:
   ```
   https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback
   ```
4. Click **"SAVE"**

### 2.4 Wait for Propagation (Important!)
- Google OAuth changes can take **5-10 minutes** to propagate
- Don't test immediately after saving

## Step 3: Test the Configuration

After 5-10 minutes, test Google OAuth:

1. Go to your app's waitlist page
2. Try the "Continue with Google" button
3. Should now redirect properly without errors

## Alternative: Add Multiple URIs

If you want to support both domains, add both:
```
https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback
https://mystartup.ai/api/auth/google/callback
```

## Troubleshooting

### If you can't find the OAuth credentials:
1. Check if you're in the correct Google Cloud project
2. Look in **APIs & Services > Credentials**
3. The credential type should be "OAuth 2.0 Client IDs"

### If you don't have OAuth credentials yet:
1. Click **"CREATE CREDENTIALS"**
2. Select **"OAuth client ID"**
3. Choose **"Web application"**
4. Add the redirect URI above
5. Copy the Client ID and Client Secret to your environment variables

### If you get permission errors:
1. Make sure you have edit access to the Google Cloud project
2. Check if you're the project owner or have the IAM role "Editor"

## Environment Variables Check

Make sure these are set in your Replit environment:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Next Steps

Once configured:
1. Test Google OAuth login
2. Test Google OAuth waitlist signup
3. Verify user creation and session management
4. Deploy to production with confidence

The platform is ready for production deployment once Google OAuth is working!