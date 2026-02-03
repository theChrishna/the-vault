import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // --- DEBUG LOGS (Check your VS Code Terminal) ---
  console.log("--- DEBUG: Google Auth Start ---");
  console.log("1. Checking GOOGLE_CLIENT_ID:", clientId ? "EXISTS" : "MISSING");
  console.log("2. Checking NEXT_PUBLIC_APP_URL:", baseUrl ? "EXISTS" : "MISSING");
  console.log("3. Base URL Value:", baseUrl);
  // ----------------------------------------

  if (!clientId) {
    console.error("CRITICAL ERROR: Google Client ID is missing in .env.local");
    return NextResponse.json({ error: "Configuration Error: Google Client ID is missing" }, { status: 500 });
  }

  if (!baseUrl) {
    console.error("CRITICAL ERROR: NEXT_PUBLIC_APP_URL is missing in .env.local");
    return NextResponse.json({ error: "Configuration Error: App URL is missing" }, { status: 500 });
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  console.log("4. Constructed Redirect URI:", redirectUri);

  try {
    // Construct the Google OAuth URL
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid email profile');
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('prompt', 'consent');

    return NextResponse.redirect(url.toString());
  } catch (err) {
    console.error("Error constructing Google URL:", err);
    return NextResponse.json({ error: "Failed to build auth URL" }, { status: 500 });
  }
}