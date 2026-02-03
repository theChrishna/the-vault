import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import mongoose from 'mongoose';

// Helper function to get authenticated user ID
async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (typeof userData === 'string' || !userData.id) return null;
    return userData.id;
  } catch (error) {
    return null;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = await getAuthUserId();

    // 1. Check for authentication
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided.' },
        { status: 401 }
      );
    }

    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const capsuleId = resolvedParams.id;

    // 2. Validate the Capsule ID
    if (!mongoose.Types.ObjectId.isValid(capsuleId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid capsule ID format.' },
        { status: 400 }
      );
    }

    // 3. Find the capsule to ensure it exists
    const capsule = await Capsule.findById(capsuleId);

    if (!capsule) {
      return NextResponse.json(
        { success: false, message: 'Capsule not found.' },
        { status: 404 }
      );
    }

    // 4. Security Check: Ensure the user owns this capsule
    if (capsule.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You do not own this capsule.' },
        { status: 403 }
      );
    }

    // 5. Security Check: Only allow deleting *unlocked* capsules
    // (You can remove this check if you want to allow deleting locked capsules too)
    if (new Date(capsule.unlockDate) > new Date()) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: This capsule is still locked.' },
        { status: 403 }
      );
    }

    // 6. Perform the delete operation
    await Capsule.findByIdAndDelete(capsuleId);

    return NextResponse.json(
      { success: true, message: 'Capsule deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting capsule:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred on the server.' },
      { status: 500 }
    );
  }
}