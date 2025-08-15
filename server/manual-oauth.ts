import type { Request, Response } from "express";
import { storage } from "./storage";

// Manual Google OAuth implementation to bypass Passport.js issues
export async function initiateGoogleOAuth(req: Request, res: Response) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `https://${req.get('host')}/api/auth/google/manual/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'profile email',
    access_type: 'offline',
    prompt: 'select_account'
  });

  const authUrl = `https://accounts.google.com/oauth/authorize?${params.toString()}`;
  
  console.log('🔍 Manual OAuth URL:', authUrl);
  console.log('🔍 Redirect URI:', redirectUri);
  
  res.redirect(authUrl);
}

export async function handleGoogleOAuthCallback(req: Request, res: Response) {
  const { code, error } = req.query;
  
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect('/app?error=oauth_denied');
  }

  if (!code) {
    console.error('No authorization code received');
    return res.redirect('/app?error=oauth_failed');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: `https://${req.get('host')}/api/auth/google/manual/callback`
      })
    });

    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      console.error('Failed to get access token:', tokens);
      return res.redirect('/app?error=token_exchange_failed');
    }

    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });

    const profile = await profileResponse.json();
    
    console.log('🔍 Google profile received:', { 
      id: profile.id, 
      email: profile.email, 
      name: profile.name 
    });

    // Check if user exists
    let user = await storage.getUserByGoogleId(profile.id);
    
    if (!user && profile.email) {
      // Check if user exists by email
      user = await storage.getUserByEmail(profile.email);
      if (user) {
        // Link Google ID to existing user
        user = await storage.updateUser(user.id, {
          googleId: profile.id,
          avatar: profile.picture
        });
      }
    }

    if (!user) {
      // Create new user
      user = await storage.createUser({
        email: profile.email || '',
        name: profile.name || '',
        googleId: profile.id,
        avatar: profile.picture,
        emailVerified: true
      });
    }

    // Log the user in using session (not Passport.js since it may be causing issues)
    (req.session as any).userId = user.id;
    (req.session as any).user = user;
    
    // Also save session to ensure it persists
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/app?error=session_failed');
      }
      
      console.log('✅ Google OAuth successful for user:', user.email);
      console.log('✅ Session saved with userId:', user.id);
      res.redirect('/dashboard');
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/app?error=oauth_callback_failed');
  }
}