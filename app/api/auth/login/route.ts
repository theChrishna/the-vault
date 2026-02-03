import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // 1. Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist." },
        { status: 400 }
      );
    }

    // 2. Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 400 }
      );
    }

    // --- CRITICAL CHECK: Enforce Email Verification ---
    // We cast to 'any' to avoid TypeScript errors if the type definition isn't updated yet
    if ((user as any).isVerified === false) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before logging in." },
        { status: 401 }
      );
    }

    // 3. If credentials are correct & verified, create a JWT payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    // 4. Sign the token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // 5. Return a success response and set the token in an HTTP-only cookie
    const response = NextResponse.json(
      { success: true, message: "Login successful." },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login." },
      { status: 500 }
    );
  }
}