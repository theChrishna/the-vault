"use client";

import { useState } from 'react';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function CreateCapsulePage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let attachment = null;
      let attachmentName = null;
      let attachmentType = null;

      if (file) {
        // FIX: Lowered limit to 3MB to account for Base64 overhead (3MB * 1.33 = ~4MB)
        // This keeps it under Vercel's 4.5MB Serverless Function Payload limit.
        if (file.size > 3 * 1024 * 1024) {
            throw new Error("File is too large. Please select a file under 3MB.");
        }
        attachment = await toBase64(file);
        attachmentName = file.name;
        attachmentType = file.type;
      }

      const response = await fetch('/api/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            title, 
            message, 
            unlockDate,
            attachment,
            attachmentName,
            attachmentType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/vault';
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif text-gray-800 font-bold">Create a New Capsule</h1>
            <Link href="/vault" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              <span>Back to Vault</span>
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Capsule Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="e.g., My Ambitions for 2030"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message to Your Future Self
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Write down your goals, feelings, predictions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            {/* FILE UPLOAD SECTION */}
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                Attach a File (Image, PDF, etc.) - Optional
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:text-gray-700"
                    >
                      <span className="px-2">Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {file ? `Selected: ${file.name}` : "PNG, JPG, PDF up to 3MB"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="unlockDate" className="block text-sm font-medium text-gray-700">
                Unlock Date
              </label>
              <div className="mt-1">
                <input
                  id="unlockDate"
                  name="unlockDate"
                  type="date"
                  required
                  min={getTodayString()}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Seal the Capsule'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}