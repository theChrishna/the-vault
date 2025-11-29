import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // 1. Connect to the database
  await dbConnect();
  console.log("SERVER IS USING THIS URI:", process.env.MONGODB_URI);
  try {
    // 2. Get the user data from the request body
    const { name, email, password } = await request.json();

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // 4. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 5. Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 6. Return a success response
    return NextResponse.json(
      { success: true, message: "User registered successfully." },
      { status: 201 } // 201 means "Created"
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}