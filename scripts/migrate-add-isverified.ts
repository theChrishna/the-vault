/**
 * Migration script to add isVerified field to existing users
 * Run with: npx tsx scripts/migrate-add-isverified.ts
 */

import dbConnect from '../lib/dbConnect';
import User from '../models/User';

async function migrateUsers() {
    try {
        await dbConnect();
        console.log('Connected to database');

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

        console.log(`Migration complete!`);
        console.log(`Updated ${result.modifiedCount} user(s)`);

        // Show total users
        const totalUsers = await User.countDocuments();
        console.log(`Total users in database: ${totalUsers}`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateUsers();
