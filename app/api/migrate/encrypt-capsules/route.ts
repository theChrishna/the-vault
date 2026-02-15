import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import { encrypt } from '@/lib/encryption';

/**
 * Migration endpoint to encrypt existing unencrypted capsules
 * This should be called once after deploying the encryption feature
 * to encrypt all existing capsule data
 */

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

export async function POST(request: Request) {
    try {
        await dbConnect();
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find all unencrypted capsules for this user
        const unencryptedCapsules = await Capsule.find({
            user: userId,
            $or: [
                { isEncrypted: { $ne: true } },
                { isEncrypted: { $exists: false } }
            ]
        });

        if (unencryptedCapsules.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No capsules need encryption',
                count: 0
            });
        }

        let successCount = 0;
        let errorCount = 0;

        // Encrypt each capsule
        for (const capsule of unencryptedCapsules) {
            try {
                // Encrypt the fields
                capsule.title = encrypt(capsule.title, userId);
                capsule.message = encrypt(capsule.message, userId);

                if (capsule.attachment) {
                    capsule.attachment = encrypt(capsule.attachment, userId);
                }

                capsule.isEncrypted = true;

                await capsule.save();
                successCount++;
            } catch (error) {
                console.error(`Failed to encrypt capsule ${capsule._id}:`, error);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully encrypted ${successCount} capsules`,
            total: unencryptedCapsules.length,
            successCount,
            errorCount
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { success: false, message: 'Migration failed', error: String(error) },
            { status: 500 }
        );
    }
}
