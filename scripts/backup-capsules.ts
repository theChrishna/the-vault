/**
 * Simple backup script to export all capsules to JSON
 * 
 * Usage: npx ts-node scripts/backup-capsules.ts
 */

import fs from 'fs';
import path from 'path';
import dbConnect from '../lib/dbConnect';
import Capsule from '../models/Capsule';
import User from '../models/User';

async function backupCapsules() {
    console.log('📦 Starting capsule backup...\n');

    try {
        // Connect to database
        await dbConnect();
        console.log('✅ Connected to database');

        // Fetch all capsules
        const capsules = await Capsule.find({}).populate('user').lean();
        const users = await User.find({}).lean();

        console.log(`📊 Found ${capsules.length} capsules`);
        console.log(`👥 Found ${users.length} users\n`);

        // Create backup directory
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const capsuleFile = path.join(backupDir, `capsules-backup-${timestamp}.json`);
        const userFile = path.join(backupDir, `users-backup-${timestamp}.json`);

        // Write to files
        fs.writeFileSync(capsuleFile, JSON.stringify(capsules, null, 2));
        fs.writeFileSync(userFile, JSON.stringify(users, null, 2));

        console.log('✅ Backup completed successfully!');
        console.log(`\n📁 Backup files created:`);
        console.log(`   ${capsuleFile}`);
        console.log(`   ${userFile}`);
        console.log(`\n💾 Total size: ${(fs.statSync(capsuleFile).size / 1024).toFixed(2)} KB`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    }
}

// Run the backup
backupCapsules();
