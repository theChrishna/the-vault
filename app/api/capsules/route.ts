import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import { encrypt, decrypt } from '@/lib/encryption';

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

    // Encrypt sensitive data before storing
    const encryptedTitle = encrypt(title, userId);
    const encryptedMessage = encrypt(message, userId);
    const encryptedAttachment = attachment ? encrypt(attachment, userId) : undefined;

    const newCapsule = await Capsule.create({
      user: userId,
      title: encryptedTitle,
      message: encryptedMessage,
      unlockDate,
      // Save encrypted attachment if it exists
      attachment: encryptedAttachment,
      attachmentName,
      attachmentType,
      isEncrypted: true,
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

    console.log('[Capsule List] Fetching capsules for userId:', userId);

    // Only return fields needed for the vault view 
    // We explicitly exclude '-attachment' to keep the payload small and fast
    const capsules = await Capsule.find({ user: userId }).select('-attachment');

    // Decrypt the capsules data
    const decryptedCapsules = capsules.map(capsule => {
      const capsuleObj = capsule.toObject();

      console.log(`[Capsule ${capsuleObj._id}] isEncrypted: ${capsuleObj.isEncrypted}, title preview: ${capsuleObj.title?.substring(0, 30)}...`);

      if (capsuleObj.isEncrypted) {
        // Check and decrypt TITLE
        const titleLooksEncrypted = capsuleObj.title && typeof capsuleObj.title === 'string' && capsuleObj.title.split(':').length === 3;
        if (titleLooksEncrypted) {
          try {
            capsuleObj.title = decrypt(capsuleObj.title, userId);
          } catch (error) {
            console.error(`[Capsule ${capsuleObj._id}] ✗ Title decryption failed:`, error);
            capsuleObj.title = '[Encrypted Title]';
          }
        }

        // Check and decrypt MESSAGE
        const messageLooksEncrypted = capsuleObj.message && typeof capsuleObj.message === 'string' && capsuleObj.message.split(':').length === 3;
        if (messageLooksEncrypted) {
          try {
            capsuleObj.message = decrypt(capsuleObj.message, userId);
          } catch (error) {
            console.error(`[Capsule ${capsuleObj._id}] ✗ Message decryption failed:`, error);
            capsuleObj.message = '[Encrypted Message]';
          }
        }

        console.log(`[Capsule ${capsuleObj._id}] Processed. Title: ${capsuleObj.title ? 'OK/Plain' : 'Missing'}, Message: ${capsuleObj.message ? 'OK/Plain' : 'Missing'}`);
      }

      return capsuleObj;
    });

    return NextResponse.json({ success: true, data: decryptedCapsules }, { status: 200 });

  } catch (error) {
    console.error('Error fetching capsules:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
