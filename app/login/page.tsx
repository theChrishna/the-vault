"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => { window.location.href = '/vault'; }, 1500);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB] dark:bg-background-dark transition-colors duration-300">
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

      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <div className="relative inline-block mb-4 w-16 h-16">
            {/* Light Mode Logo */}
            <Image
              src="/logo-light.svg"
              alt="Logo"
              fill
              className="object-contain dark:hidden"
            />
            {/* Dark Mode Logo */}
            <Image
              src="/logo-dark.svg"
              alt="Logo"
              fill
              className="object-contain hidden dark:block"
            />
          </div>
          <h1 className="text-4xl font-serif text-gray-800 dark:text-text-main-dark">
            Sign In to <span className="font-bold">Your Account</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-white/20 px-3 py-3 text-gray-900 dark:text-text-main-dark placeholder-gray-500 dark:placeholder-text-muted-dark focus:z-10 focus:border-gray-500 dark:focus:border-white/40 focus:outline-none focus:ring-gray-500 dark:focus:ring-white/40 sm:text-sm bg-white dark:bg-surface-dark transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-white/20 px-3 py-3 text-gray-900 dark:text-text-main-dark placeholder-gray-500 dark:placeholder-text-muted-dark focus:z-10 focus:border-gray-500 dark:focus:border-white/40 focus:outline-none focus:ring-gray-500 dark:focus:ring-white/40 sm:text-sm bg-white dark:bg-surface-dark transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 dark:text-text-muted-dark" /> : <Eye className="h-5 w-5 text-gray-400 dark:text-text-muted-dark" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400 text-center pt-2">{error}</p>}

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading || success}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-black dark:bg-white py-3 px-4 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white/40 focus:ring-offset-2 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing In...' : success ? 'Success!' : 'Sign In'}
            </button>

            {/* --- GOOGLE LOGIN BUTTON --- */}
            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-surface-dark py-3 px-4 text-sm font-medium text-gray-700 dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white/40 focus:ring-offset-2 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </a>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-text-muted-dark">
          don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-gray-900 dark:text-text-main-dark hover:text-gray-700 dark:hover:text-white underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}