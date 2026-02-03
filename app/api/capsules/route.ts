import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';

// Helper function to get authenticated user ID
// FIX: Made async because cookies() is async in Next.js 15
async function getAuthUserId(): Promise<string | null> {
  // FIX: Await cookies() before accessing it
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

export async function POST(request: Request) {
  try {
    await dbConnect();
    // FIX: Await the helper function since it's now async
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { title, message, unlockDate, attachment, attachmentName, attachmentType } = await request.json();

    if (!title || !message || !unlockDate) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const newCapsule = await Capsule.create({
      user: userId,
      title,
      message,
      unlockDate,
      // Save the new fields if they exist
      attachment,
      attachmentName,
      attachmentType
    });

    return NextResponse.json({ success: true, data: newCapsule }, { status: 201 });

  } catch (error) {
    console.error('Error creating capsule:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    // FIX: Await the helper function
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Only return fields needed for the vault view 
    // We explicitly exclude '-attachment' to keep the payload small and fast
    const capsules = await Capsule.find({ user: userId }).select('-attachment');

    return NextResponse.json({ success: true, data: capsules }, { status: 200 });

  } catch (error) {
    console.error('Error fetching capsules:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}