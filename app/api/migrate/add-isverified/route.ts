import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

/**
 * Migration endpoint to add isVerified field to existing users
 * Access: http://localhost:3000/api/migrate/add-isverified
 */
export async function GET() {
    try {
        await dbConnect();

        // Update all users that don't have isVerified field
        const result = await User.updateMany(
            { isVerified: { $exists: false } }, // Find users without isVerified
            {
                $set: {
                    isVerified: true, // Set existing users as verified
                    verifyToken: undefined,
                    verifyTokenExpiry: undefined
                }
            }
        );

        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get verified users count
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully',
            stats: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount,
                totalUsers,
                verifiedUsers
            }
        });

    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Migration failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
