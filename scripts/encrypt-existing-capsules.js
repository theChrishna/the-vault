/**
 * Migration script to encrypt all existing capsules
 * 
 * Usage: node scripts/encrypt-existing-capsules.js
 * 
 * This will encrypt all unencrypted capsules in the database
 */

const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Database connection
async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
}

// Capsule Schema
const CapsuleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    unlockDate: { type: Date, required: true },
    attachment: String,
    attachmentName: String,
    attachmentType: String,
    isEncrypted: { type: Boolean, default: false }
}, { timestamps: true });

const Capsule = mongoose.models.Capsule || mongoose.model('Capsule', CapsuleSchema);

// Encryption functions
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100000;

function deriveUserKey(userId) {
    const secret = process.env.ENCRYPTION_SECRET;
    if (!secret) {
        throw new Error('ENCRYPTION_SECRET is not defined');
    }
    const salt = crypto.createHash('sha256').update(userId).digest();
    return crypto.pbkdf2Sync(secret, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

function encrypt(plaintext, userId) {
    if (!plaintext) return '';

    const key = deriveUserKey(userId);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

// Migration function
async function migrateAllCapsules() {
    console.log('🔐 Starting capsule encryption migration...\n');

    try {
        await dbConnect();

        // Find all unencrypted capsules
        const unencryptedCapsules = await Capsule.find({
            $or: [
                { isEncrypted: { $ne: true } },
                { isEncrypted: { $exists: false } }
            ]
        });

        console.log(`📊 Found ${unencryptedCapsules.length} unencrypted capsules\n`);

        if (unencryptedCapsules.length === 0) {
            console.log('✅ No capsules need encryption. All done!');
            await mongoose.connection.close();
            process.exit(0);
        }

        let successCount = 0;
        let errorCount = 0;

        // Encrypt each capsule
        for (const capsule of unencryptedCapsules) {
            try {
                // Get userId as string directly from the capsule
                const userId = capsule.user.toString();

                console.log(`Processing capsule: ${capsule._id}`);
                console.log(`  User ID: ${userId}`);
                console.log(`  Title: ${capsule.title.substring(0, 30)}...`);

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
                console.error(`  ❌ Failed to encrypt capsule ${capsule._id}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n📈 Migration Summary:');
        console.log(`  Total capsules: ${unencryptedCapsules.length}`);
        console.log(`  ✅ Successfully encrypted: ${successCount}`);
        console.log(`  ❌ Failed: ${errorCount}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
migrateAllCapsules();
