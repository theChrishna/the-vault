"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link'; // Import Link

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setSuccess(true);
        // Redirect after a short delay to show the success state
        setTimeout(() => {
            window.location.href = '/vault'; 
        }, 1500);
      } else {
        // Login failed
        setError(data.message || 'Something went wrong.');
      }
    } catch {
      // FIX: Removed unused 'err' variable
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Custom background color as requested
    <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB]">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            {/* You can replace this with your actual logo component or SVG */}
            <div className="inline-block mb-4 text-red-500">
                <svg width="60" height="40" viewBox="0 0 76 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.2162 50.1333L0 23.9171L6.30631 17.6108L26.2162 37.5207L69.6937 4.04321L76 10.3495L26.2162 50.1333Z" fill="#F43F5E"/>
                </svg>
            </div>
          <h1 className="text-4xl font-serif text-gray-800">
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
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-black focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-black focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
            
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-black py-3 px-4 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : success ? 'Success!' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
        don&apos;t have an account?{' '}
          {/* FIX: Changed <a> to <Link> */}
          <Link href="/register" className="font-medium text-gray-900 hover:text-gray-700 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}