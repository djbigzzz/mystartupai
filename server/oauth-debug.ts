import { Request, Response } from "express";

// Direct OAuth URL generation to debug redirect_uri_mismatch
export function debugOAuthConfiguration(req: Request, res: Response) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `https://${req.get('host')}/api/auth/google/callback`;
  const scope = "profile email";
  const responseType = "code";
  const accessType = "offline";
  
  console.log('🔍 === OAUTH DEBUG CONFIGURATION ===');
  console.log('🔍 Client ID:', clientId?.substring(0, 20) + '...');
  console.log('🔍 Host:', req.get('host'));
  console.log('🔍 Redirect URI:', redirectUri);
  console.log('🔍 Generated OAuth URL:');
  
  const oauthUrl = `https://accounts.google.com/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=${responseType}&` +
    `access_type=${accessType}&` +
    `prompt=select_account`;
    
  console.log(oauthUrl);
  
  res.json({
    configuration: {
      clientId: clientId?.substring(0, 20) + '...',
      redirectUri,
      scope,
      responseType,
      accessType
    },
    oauthUrl,
    expectedRedirectUris: [
      `https://${req.get('host')}/api/auth/google/callback`,
      `https://${req.get('host')}/api/auth/google/waitlist/callback`
    ]
  });
}

// Test if the redirect URI is exactly what Google expects
export function testRedirectUri(req: Request, res: Response) {
  const host = req.get('host');
  const protocol = req.protocol;
  const expectedUri = `${protocol}://${host}/api/auth/google/callback`;
  
  console.log('🔍 === REDIRECT URI TEST ===');
  console.log('🔍 Host header:', host);
  console.log('🔍 Protocol:', protocol);
  console.log('🔍 Expected URI:', expectedUri);
  console.log('🔍 REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS);
  
  res.json({
    host,
    protocol,
    expectedUri,
    replitDomains: process.env.REPLIT_DOMAINS,
    matches: expectedUri === `https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/callback`
  });
}