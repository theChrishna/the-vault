import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ✅ CRITICAL: Ensure this line starts with 'export async function GET'
// Do NOT use 'export default'
export async function GET(request: Request) {
  console.log("--- GOOGLE CALLBACK HIT ---"); // Verify the route is reached

  // 1. Database Connection
  await dbConnect();

  // 2. Parse Query Params
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: "No code provided from Google" }, { status: 400 });
  }

  // --- Environment Variable Configuration ---
  // Credentials are loaded from environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  console.log("--- DEBUG CREDENTIALS ---");
  console.log("Client ID being used:", clientId);
  console.log("Client Secret status:", clientSecret ? "EXISTS" : "MISSING");

  // Safety check to prevent crashing if keys are missing
  if (!clientId || !clientSecret) {
    console.error("CRITICAL: OAuth credentials are missing or not configured.");
    return NextResponse.json({ error: "Server Configuration Error: Missing Credentials" }, { status: 500 });
  }
  // --- DEBUGGING END ---

  try {
    // 3. Exchange Code for Tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google Token Error:", tokenData);
      return NextResponse.json({ error: "Failed to exchange code", details: tokenData }, { status: 400 });
    }

    // 4. Get User Profile
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userResponse.json();

    // 5. Find or Create User
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // New User: Generate random password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: randomPassword,
        isVerified: true,
        verifyToken: undefined,
      });
    } else {
      // Existing User: Ensure verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // 6. Generate Session Token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // 7. Set Cookie and Redirect
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/vault`);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=callback_failed`);
  }
}