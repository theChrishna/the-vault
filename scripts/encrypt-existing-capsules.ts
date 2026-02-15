/**
 * Migration script to encrypt all existing capsules
 * 
 * Usage: node scripts/encrypt-existing-capsules.js
 * 
 * This will encrypt all unencrypted capsules in the database
 */

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const dbConnect = require('../lib/dbConnect').default;
const Capsule = require('../models/Capsule').default;
const { encrypt } = require('../lib/encryption');

async function migrateAllCapsules() {
    console.log('🔐 Starting capsule encryption migration...\n');

    try {
        // Connect to database
        await dbConnect();
        console.log('✅ Connected to database');

        // Find all unencrypted capsules (for ALL users)
        const unencryptedCapsules = await Capsule.find({
            $or: [
                { isEncrypted: { $ne: true } },
                { isEncrypted: { $exists: false } }
            ]
        }).populate('user');

        console.log(`📊 Found ${unencryptedCapsules.length} unencrypted capsules\n`);

        if (unencryptedCapsules.length === 0) {
            console.log('✅ No capsules need encryption. All done!');
            process.exit(0);
        }

        let successCount = 0;
        let errorCount = 0;

        // Encrypt each capsule
        for (const capsule of unencryptedCapsules) {
            try {
                const userId = capsule.user._id.toString();

                console.log(`Processing capsule: ${capsule._id}`);
                console.log(`  Title: ${capsule.title.substring(0, 30)}...`);
                console.log(`  User: ${userId}`);

                // Encrypt the fields
                capsule.title = encrypt(capsule.title, userId);
                capsule.message = encrypt(capsule.message, userId);

                if (capsule.attachment) {
                    capsule.attachment = encrypt(capsule.attachment, userId);
                }

                capsule.isEncrypted = true;

                await capsule.save();
                successCount++;
                console.log(`  ✅ Encrypted successfully\n`);
            } catch (error) {
                console.error(`  ❌ Failed to encrypt capsule ${capsule._id}:`, error);
                errorCount++;
                console.log('');
            }
        }

        console.log('\n📈 Migration Summary:');
        console.log(`  Total capsules: ${unencryptedCapsules.length}`);
        console.log(`  ✅ Successfully encrypted: ${successCount}`);
        console.log(`  ❌ Failed: ${errorCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
migrateAllCapsules();
