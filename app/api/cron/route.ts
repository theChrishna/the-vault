import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import User from '@/models/User'; // Required for populating user details
import nodemailer from 'nodemailer';

// Mark as dynamic so Vercel doesn't cache the result
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Smart Security Check
    // This automatically detects if you are on Localhost vs Production
    const authHeader = request.headers.get('authorization');
    const isDevelopment = process.env.NODE_ENV === 'development';

    // If we are in PRODUCTION (Vercel) and the secret is wrong -> Block it.
    // If we are in DEVELOPMENT (Localhost) -> Allow it (skip check).
    if (!isDevelopment && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await dbConnect();

    // 2. Calculate "Today" (00:00 to 23:59)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log(`--- CRON JOB START ---`);
    console.log(`Looking for capsules unlocking between:`);
    console.log(`Start: ${startOfDay.toISOString()}`);
    console.log(`End:   ${endOfDay.toISOString()}`);

    // 3. Query the Database
    // FIX: We explicitly pass the 'User' model here to avoid MissingSchemaError
    const capsulesToUnlock = await Capsule.find({
      unlockDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate({ path: 'user', model: User });

    console.log(`Found ${capsulesToUnlock.length} capsules.`);

    if (capsulesToUnlock.length === 0) {
      return NextResponse.json({ success: true, message: 'No capsules unlocking today.' });
    }

    // 4. Create Nodemailer Transporter (Using your working Gmail credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Send Emails
    const emailPromises = capsulesToUnlock.map(async (capsule) => {
      const user = capsule.user as any;
      const userEmail = user?.email;
      const userName = user?.name || 'Time Traveler';

      if (userEmail) {
        try {
          // Fallback to localhost if env var is missing during dev
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const unlockUrl = `${baseUrl}/vault/${capsule._id}`;

          console.log(`Sending email to ${userEmail} for capsule ${capsule._id}`);

          await transporter.sendMail({
            from: `"The Goal Time Capsule" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🔓 Your Time Capsule has Unlocked!',
            html: `
              <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2>Hello ${userName},</h2>
                <p>A message from your past self is ready to be unveiled.</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">${capsule.title}</h3>
                  <p style="color: #666; font-size: 14px;">Sealed on ${new Date(capsule.createdAt).toLocaleDateString()}</p>
                </div>
                <p>Click the button below to read your message:</p>
                <div style="margin: 20px 0;">
                  <a href="${unlockUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Open Capsule</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #888;">Link: <a href="${unlockUrl}">${unlockUrl}</a></p>
              </div>
            `,
          });

          return { id: capsule._id, status: 'sent' };
        } catch (err) {
          console.error(`Failed to email user ${userEmail}`, err);
          return { id: capsule._id, status: 'failed' };
        }
      }
    });

    const results = await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Processed ${capsulesToUnlock.length} capsules.`,
      results
    });

  } catch (error) {
    console.error('Cron Job Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}