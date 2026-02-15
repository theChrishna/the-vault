"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // If no token is present in the URL
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified! Redirecting to login...');
          // Optional: Redirect automatically after 3 seconds
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB] dark:bg-background-dark transition-colors duration-300 p-4">
      {/* Theme Toggle & Feedback - Fixed Position */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <a
          href={process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FORM}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-600 dark:text-text-muted-dark hover:text-black dark:hover:text-white transition-colors"
        >
          Feedback
        </a>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-dark rounded-lg shadow text-center">

        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-700">Verifying...</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Verified!</h2>
            <p className="text-gray-600">Your email has been confirmed.</p>
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Go to Login
            </Link>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="text-red-600">{message}</p>
            <Link href="/register" className="text-blue-600 hover:underline mt-4">
              Back to Sign Up
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  // Wrap in Suspense because useSearchParams causes client-side rendering de-opt in Next.js
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}