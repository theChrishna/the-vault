import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Capsule from '@/models/Capsule';
import mongoose from 'mongoose';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';

async function getSingleCapsule(capsuleId: string, userId: string) {
    try {
        await dbConnect();

        if (!mongoose.Types.ObjectId.isValid(capsuleId)) {
            return null;
        }

        const capsule = await Capsule.findById(capsuleId);

        if (!capsule || capsule.user.toString() !== userId || new Date(capsule.unlockDate) > new Date()) {
            return null;
        }

        return JSON.parse(JSON.stringify(capsule));
    } catch (error) {
        console.error("Error fetching single capsule:", error);
        return null;
    }
}

export default async function SingleCapsulePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

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
            <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB] text-center p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Capsule Not Found</h1>
                    <p className="text-gray-600 mt-2">This capsule may not exist, isn&apos;t unlocked yet, or you don&apos;t have permission to view it.</p>
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

                    <div className="prose max-w-none mb-8">
                        <p className="text-black whitespace-pre-wrap">{capsule.message}</p>
                    </div>

                    {/* --- ATTACHMENT DISPLAY SECTION --- */}
                    {capsule.attachment && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Download className="mr-2 h-5 w-5" />
                                Attached Memory
                            </h3>

                            {/* Check if it's an image to display it directly */}
                            {capsule.attachmentType?.startsWith('image/') ? (
                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                    {/* Use standard img tag for base64 data URIs */}
                                    <img
                                        src={capsule.attachment}
                                        alt={capsule.attachmentName || "Capsule Image"}
                                        className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                                    />
                                </div>
                            ) : (
                                /* For non-images (PDFs, etc), show a download card */
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <FileText className="h-8 w-8 text-gray-500 mr-4" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {capsule.attachmentName || "Unknown File"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {capsule.attachmentType || "File"}
                                        </p>
                                    </div>
                                    <a
                                        href={capsule.attachment}
                                        download={capsule.attachmentName || "download"}
                                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
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