// VERCEL UPDATE TRIGGER: Next.js 15 Fix (Cookies)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import mongoose from 'mongoose';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { decrypt } from '@/lib/encryption';

async function getSingleCapsule(capsuleId: string, userId: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(capsuleId)) {
      return null;
    }

    // FIX: Use .lean() to get a plain JavaScript object
    // This ensures we get all fields without Mongoose magic interfering
    const capsule = await Capsule.findById(capsuleId).lean() as any;

    if (!capsule || capsule.user.toString() !== userId || new Date(capsule.unlockDate) > new Date()) {
      return null;
    }

    // --- DEBUG LOGS (Check your VS Code terminal when viewing the page) ---
    console.log(`Debug View: Fetching capsule ${capsuleId}`);
    console.log("Debug View: Attachment Name:", capsule.attachmentName);
    // This tells us if the data is actually in the database
    console.log("Debug View: Has Attachment Data:", !!capsule.attachment ? "YES" : "NO");
    // ---------------------------------------------------------------------

    // Decrypt data if capsule is encrypted
    if (capsule.isEncrypted) {
      // Check and decrypt TITLE
      const titleLooksEncrypted = capsule.title && typeof capsule.title === 'string' && capsule.title.split(':').length === 3;
      if (titleLooksEncrypted) {
        try {
          capsule.title = decrypt(capsule.title, userId);
        } catch (error) {
          console.error(`[Capsule ${capsuleId}] ✗ Title decryption failed:`, error);
          capsule.title = '[Encrypted Title]';
        }
      }

      // Check and decrypt MESSAGE
      const messageLooksEncrypted = capsule.message && typeof capsule.message === 'string' && capsule.message.split(':').length === 3;
      if (messageLooksEncrypted) {
        try {
          capsule.message = decrypt(capsule.message, userId);
        } catch (error) {
          console.error(`[Capsule ${capsuleId}] ✗ Message decryption failed:`, error);
          capsule.message = '[Encrypted Message]';
        }
      }

      // Check and decrypt ATTACHMENT
      // Only check attachment if it exists and is a string
      if (capsule.attachment && typeof capsule.attachment === 'string') {
        const attachmentLooksEncrypted = capsule.attachment.split(':').length === 3;
        if (attachmentLooksEncrypted) {
          try {
            capsule.attachment = decrypt(capsule.attachment, userId);
          } catch (error) {
            console.error(`[Capsule ${capsuleId}] ✗ Attachment decryption failed:`, error);
            // Don't show broken attachment data
            capsule.attachment = null;
          }
        }
      }

      console.log(`[Capsule ${capsuleId}] Decryption attempt complete.`);
    }

    // Convert Date objects and ID to strings for Next.js serialization
    return {
      ...capsule,
      _id: capsule._id.toString(),
      user: capsule.user.toString(),
      createdAt: capsule.createdAt.toISOString(),
      updatedAt: capsule.updatedAt.toISOString(),
      unlockDate: capsule.unlockDate.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching single capsule:", error);
    return null;
  }
}

// FIX: Direct type definition for params (no interface)
export default async function SingleCapsulePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // FIX: Await the params object before accessing properties
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // FIX: Await cookies() because it is async in Next.js 15
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not configured.");
  }

  let userData: JwtPayload | string;
  try {
    userData = jwt.verify(token, jwtSecret);
  } catch {
    redirect('/login');
  }

  if (typeof userData === 'string' || !userData.id) {
    redirect('/login');
  }

  const capsule = await getSingleCapsule(id, userData.id);

  if (!capsule) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB] dark:bg-background-dark text-center p-4 transition-colors duration-300">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-text-main-dark">Capsule Not Found</h1>
          <p className="text-gray-600 dark:text-text-muted-dark mt-2">This capsule may not exist, isn&apos;t unlocked yet, or you don&apos;t have permission to view it.</p>
          <Link href="/vault" className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to The Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F3FB] dark:bg-background-dark py-12 transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <Link href="/vault" className="inline-flex items-center text-gray-600 dark:text-text-muted-dark hover:text-gray-900 dark:hover:text-text-main-dark transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to The Vault
          </Link>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-lg dark:shadow-2xl p-8 border border-gray-200 dark:border-white/10">
          <h1 className="text-4xl font-serif font-bold text-black dark:text-text-main-dark">{capsule.title}</h1>
          <div className="text-sm text-gray-500 dark:text-text-muted-dark mt-4 border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
            <p>Sealed on: {new Date(capsule.createdAt).toLocaleDateString()}</p>
            <p>Unlocked on: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-black dark:text-text-main-dark whitespace-pre-wrap">{capsule.message}</p>
          </div>

          {/* --- ATTACHMENT DISPLAY SECTION --- */}

          {/* Helper UI: If file name exists but content is missing (database issue) */}
          {capsule.attachmentName && !capsule.attachment && (
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
              <strong>Debug Warning:</strong> File name &quot;{capsule.attachmentName}&quot; was found, but the file content is missing.
              This likely happened because the server was not restarted after updating the database model. Please restart the server and create a new capsule.
            </div>
          )}

          {capsule.attachment && (
            <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-text-main-dark mb-4 flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Attached Memory
              </h3>

              {/* Check if it's an image to display it directly */}
              {capsule.attachmentType?.startsWith('image/') ? (
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                  {/* Use standard img tag for base64 data URIs */}
                  <img
                    src={capsule.attachment}
                    alt={capsule.attachmentName || "Capsule Image"}
                    className="w-full h-auto max-h-[500px] object-contain bg-gray-50 dark:bg-background-dark"
                  />
                </div>
              ) : (
                /* For non-images (PDFs, etc), show a download card */
                <div className="flex items-center p-4 bg-gray-50 dark:bg-background-dark rounded-lg border border-gray-200 dark:border-white/10">
                  <FileText className="h-8 w-8 text-gray-500 dark:text-text-muted-dark mr-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-text-main-dark truncate">
                      {capsule.attachmentName || "Unknown File"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-text-muted-dark">
                      {capsule.attachmentType || "File"}
                    </p>
                  </div>
                  <a
                    href={capsule.attachment}
                    download={capsule.attachmentName || "download"}
                    className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-white/20 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-text-main-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none transition-colors"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
