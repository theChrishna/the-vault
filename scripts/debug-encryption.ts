
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { decrypt, deriveUserKey } from '../lib/encryption';
import Capsule from '../models/Capsule';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugEncryption() {
    console.log('--- Debugging Encryption ---');

    if (!process.env.MONGODB_URI) {
        console.error('ERROR: MONGODB_URI is marked as defined in env? ', !!process.env.MONGODB_URI);
        return;
    }

    if (!process.env.ENCRYPTION_SECRET) {
        console.error('ERROR: ENCRYPTION_SECRET is missing!');
        return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    try {
        const capsules = await Capsule.find({}).sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${capsules.length} recent capsules.`);

        for (const capsule of capsules) {
            console.log(`\n--- Capsule ID: ${capsule._id} ---`);
            console.log(`User ID: ${capsule.user}`);
            console.log(`isEncrypted flag: ${capsule.isEncrypted}`);

            const userId = capsule.user.toString();

            // TITLE CHECK
            const rawTitle = capsule.title || '';
            console.log(`Raw Title (first 50 chars): ${rawTitle.substring(0, 50)}...`);
            const titleParts = rawTitle.split(':');
            console.log(`Title Parts Count: ${titleParts.length}`);

            if (capsule.isEncrypted) {
                if (titleParts.length === 3) {
                    try {
                        const decrypted = decrypt(rawTitle, userId);
                        console.log(`✅ Title Decrypted successfully: "${decrypted.substring(0, 20)}..."`);
                    } catch (e: any) {
                        console.log(`❌ Title Decryption FAILED: ${e.message}`);
                        // Check if key seems to generate correct length
                        try {
                            const key = deriveUserKey(userId);
                            console.log(`   (Derived Key Length: ${key.length} bytes)`);
                        } catch (kErr) {
                            console.log(`   (Key Derivation Failed: ${kErr})`);
                        }
                    }
                } else {
                    console.log(`⚠️ Title format invalid for encrypted string (expected 3 parts with colons).`);
                }
            } else {
                console.log(`(Capsule is not marked as encrypted, title is plaintext)`);
            }

            // MESSAGE CHECK
            // Just check length/format, don't log potentially massive message
            const rawMessage = capsule.message || '';
            const msgParts = rawMessage.split(':');
            console.log(`Message Parts Count: ${msgParts.length}`);
            if (capsule.isEncrypted && msgParts.length === 3) {
                try {
                    const decrypted = decrypt(rawMessage, userId);
                    console.log(`✅ Message Decrypted successfully.`);
                } catch (e: any) {
                    console.log(`❌ Message Decryption FAILED: ${e.message}`);
                }
            }
        }

    } catch (error) {
        console.error('Debug script error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n--- Done ---');
    }
}

debugEncryption();
