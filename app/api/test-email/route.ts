import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// This is a temporary route to test your email configuration
export async function GET() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // 1. Check if variables exist
    if (!user || !pass) {
        return NextResponse.json({
            success: false,
            error: "Missing Environment Variables",
            details: "Check .env.local for EMAIL_USER and EMAIL_PASS"
        }, { status: 500 });
    }

    try {
        // 2. Configure Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        // 3. Verify Connection
        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.error("SMTP Verify Error:", error);
                    reject(error);
                } else {
                    console.log("SMTP Server is ready");
                    resolve(success);
                }
            });
        });

        // 4. Send Test Email
        const info = await transporter.sendMail({
            from: `"Test Debugger" <${user}>`,
            to: user, // Sends to yourself to minimize variables
            subject: "Test Email from Your App",
            text: "If you are reading this, your email configuration is PERFECT! You can delete this route now.",
        });

        return NextResponse.json({
            success: true,
            message: "Email sent successfully!",
            messageId: info.messageId
        });

    } catch (error: any) {
        console.error("Email Send Error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to send email",
            details: error.message
        }, { status: 500 });
    }
}