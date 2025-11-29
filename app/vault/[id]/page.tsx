import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import mongoose from 'mongoose';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// This function securely fetches a single capsule from the database
async function getSingleCapsule(capsuleId: string, userId: string) {
  try {
    await dbConnect();
    
    if (!mongoose.Types.ObjectId.isValid(capsuleId)) {
        return null;
    }

    const capsule = await Capsule.findById(capsuleId);

    // Security Checks:
    if (!capsule || capsule.user.toString() !== userId || new Date(capsule.unlockDate) > new Date()) {
      return null;
    }

    return JSON.parse(JSON.stringify(capsule));
  } catch (error) {
    console.error("Error fetching single capsule:", error);
    return null;
  }
}

// This is the Server Component for the single capsule view page
export default async function SingleCapsulePage({ params }: { params: { id: string } }) {
  // FIX: Destructure `id` from `params` to satisfy Next.js static analysis.
  const { id } = params;

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Safer check for JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not configured.");
  }

  let userData: JwtPayload | string;
  try {
    userData = jwt.verify(token, jwtSecret);
  } catch (error) {
    redirect('/login');
  }

  if (typeof userData === 'string' || !userData.id) {
    redirect('/login');
  }

  // FIX: Use the destructured `id` variable here.
  const capsule = await getSingleCapsule(id, userData.id);

  if (!capsule) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB] text-center p-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Capsule Not Found</h1>
                <p className="text-gray-600 mt-2">This capsule may not exist, isn't unlocked yet, or you don't have permission to view it.</p>
                <Link href="/vault" className="mt-6 inline-flex items-center text-blue-600 hover:underline">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to The Vault
                </Link>
            </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F3FB] py-12">
        <main className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <Link href="/vault" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to The Vault
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-serif font-bold text-black">{capsule.title}</h1>
                <div className="text-sm text-gray-500 mt-4 border-b pb-4 mb-6">
                    <p>Sealed on: {new Date(capsule.createdAt).toLocaleDateString()}</p>
                    <p>Unlocked on: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
                </div>
                
                {/* The 'prose' class provides nice formatting, but we'll style the text color directly. */}
                <div className="prose max-w-none">
                    {/* CHANGE: Applied text-black directly to the paragraph for a more forceful override. */}
                    <p className="text-black">{capsule.message}</p>
                </div>
            </div>
        </main>
    </div>
  );
}

