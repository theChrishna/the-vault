import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }

    // Find the user with this verification token AND ensure the token hasn't expired
    // We check if verifyTokenExpiry is strictly greater ($gt) than the current time
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // Mark as verified and clean up the temporary token fields
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during verification." },
      { status: 500 }
    );
  }
}