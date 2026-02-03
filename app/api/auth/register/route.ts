import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 400 }
      );
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate Verification Token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    // Token expires in 24 hours
    const verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // 4. Create User (Unverified)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken,
      verifyTokenExpiry,
    });

    // 5. Send Email via Nodemailer
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Ensure this is in .env.local
        pass: process.env.EMAIL_PASS, // Ensure this is in .env.local
      },
    });

    console.log(`Attempting to send verification email to ${email}...`);

    try {
      await transporter.sendMail({
        from: `"The Goal Time Capsule" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h1>Welcome, ${name}!</h1>
            <p>Please verify your email address to start sealing your time capsules.</p>
            <div style="margin: 20px 0;">
              <a href="${verifyUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy this link: <br> <a href="${verifyUrl}">${verifyUrl}</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">This link expires in 24 hours.</p>
          </div>
        `,
      });

      console.log("Verification email sent successfully via Nodemailer");

    } catch (emailError) {
      console.error("Nodemailer Error:", emailError);
      // Return 201 because user IS created, even if email failed
      return NextResponse.json(
        { success: true, message: "Account created, but failed to send verification email. Please check server logs." },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Account created! Please check your email to verify." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}