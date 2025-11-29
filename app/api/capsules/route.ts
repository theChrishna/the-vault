import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import Capsule from "@/models/Capsule";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Verify the user is logged in
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get the capsule data from the request body
    const { title, message, unlockDate } = await request.json();

    // Basic validation
    if (!title || !message || !unlockDate) {
        return NextResponse.json(
            { success: false, message: "Title, message, and unlockDate are required." },
            { status: 400 }
        );
    }

    // 3. Create and save the new capsule, linking it to the user
    const newCapsule = new Capsule({
      title,
      message,
      unlockDate: new Date(unlockDate), // Ensure it's a Date object
      user: userData.id, // Get user ID from the verified token
      status: 'cooling-down', // Initial status
    });

    await newCapsule.save();

    // 4. Return a success response
    return NextResponse.json(
      { success: true, message: "Capsule sealed successfully.", data: newCapsule },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating capsule:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the capsule." },
      { status: 500 }
    );
  }

}

  // Add this GET function to your app/api/capsules/route.ts file

  export async function GET(request: NextRequest) {
    await dbConnect();
  
    try {
      // 1. Verify the user is logged in
      const userData = verifyToken(request);
      if (!userData) {
        return NextResponse.json(
          { success: false, message: "Unauthorized. Please log in." },
          { status: 401 }
        );
      }
  
      // 2. Find all capsules belonging to this user
      // We sort by unlockDate in ascending order (soonest first)
      const capsules = await Capsule.find({ user: userData.id }).sort({ unlockDate: 1 });
  
      // 3. Return the list of capsules
      return NextResponse.json(
        { success: true, message: "Capsules retrieved successfully.", data: capsules },
        { status: 200 }
      );
  
    } catch (error) {
      console.error("Error retrieving capsules:", error);
      return NextResponse.json(
        { success: false, message: "An error occurred while retrieving capsules." },
        { status: 500 }
      );
    }
  }