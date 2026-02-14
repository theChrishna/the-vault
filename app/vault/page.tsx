"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import Trash2 for the delete button
import { PlusCircle, LogOut, Loader2, Lock, Unlock, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

// Define a type for our capsule data for better type safety
type Capsule = {
  _id: string;
  title: string;
  unlockDate: string;
};

// A utility function to format the countdown text
const formatCountdown = (unlockDate: string) => {
  const now = new Date();
  const unlock = new Date(unlockDate);
  const diff = unlock.getTime() - now.getTime();

  if (diff <= 0) {
    return "Ready to Open";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `Unlocks in ${days}d ${hours}h`;
};

export default function VaultPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // NEW: State to track which capsule is being deleted
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const response = await fetch('/api/capsules');
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch capsules from the server.');
        }
        const data = await response.json();
        if (data.success) {
          setCapsules(data.data);
        } else {
          setError(data.message || 'An error occurred while fetching capsules.');
        }
      } catch {
        // FIX: Removed 'err' since it was unused
        setError('Could not connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/logout');
      if (response.ok) {
        router.push('/login');
      } else {
        console.error("Logout failed.");
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setIsLoggingOut(false);
    }
  };

  // Function to handle deleting a capsule
  const handleDelete = async (e: React.MouseEvent, capsuleId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const userConfirmed = confirm("Are you sure you want to delete this capsule? This action cannot be undone.");

    if (!userConfirmed) {
      return;
    }

    setIsDeleting(capsuleId);

    try {
      const response = await fetch(`/api/capsules/${capsuleId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 404) {
        setCapsules((prevCapsules) =>
          prevCapsules.filter((capsule) => capsule._id !== capsuleId)
        );
      } else {
        const data = await response.json();
        console.error("Failed to delete capsule:", data.message);
        alert("Failed to delete capsule: " + (data.message || "Please try again."));
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FB] dark:bg-background-dark transition-colors duration-300">
      <header className="bg-white dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-white/10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif text-gray-800 dark:text-text-main-dark font-bold">The Vault</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 text-gray-600 dark:text-text-muted-dark hover:text-gray-900 dark:hover:text-text-main-dark disabled:opacity-50 transition-colors"
              >
                {isLoggingOut ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <LogOut size={20} />
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <Link href="/capsules/create" className="inline-flex items-center justify-center rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white/40 focus:ring-offset-2 transition-colors">
            <PlusCircle size={20} className="mr-2" />
            Create New Capsule
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500 dark:text-text-muted-dark" />
          </div>
        )}

        {error && <p className="text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.length > 0 ? (
              capsules.map((capsule) => {
                const isUnlocked = new Date(capsule.unlockDate) <= new Date();

                if (isUnlocked) {
                  return (
                    <div key={capsule._id} className="bg-white dark:bg-surface-dark rounded-lg shadow dark:shadow-lg h-full transition-all duration-300 border-2 border-green-400 dark:border-green-500 flex flex-col justify-between">
                      <Link href={`/vault/${capsule._id}`} className="block group p-6 cursor-pointer hover:bg-green-50/50 dark:hover:bg-green-900/10 rounded-t-lg">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-black dark:text-text-main-dark opacity-100 pr-2 truncate">{capsule.title}</h3>
                            <Unlock className="text-green-500 dark:text-green-400 flex-shrink-0" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-text-muted-dark opacity-100 mt-2">
                            Unlocked on: {new Date(capsule.unlockDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-semibold mt-4 inline-block px-3 py-1 rounded-full text-green-800 dark:text-green-200 bg-green-200 dark:bg-green-900/40">
                            Ready to Open
                          </p>
                        </div>
                      </Link>

                      <div className="p-6 pt-4 border-t border-gray-100 dark:border-white/10">
                        <button
                          onClick={(e) => handleDelete(e, capsule._id)}
                          disabled={!!isDeleting}
                          className="flex items-center justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isDeleting === capsule._id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={16} className="mr-2" />
                              Delete Capsule
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={capsule._id}>
                      <div className="bg-white dark:bg-surface-dark rounded-lg shadow dark:shadow-lg p-6 h-full border border-gray-200 dark:border-white/10 opacity-80">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-500 dark:text-text-muted-dark pr-2 truncate">{capsule.title}</h3>
                          <Lock className="text-gray-400 dark:text-text-muted-dark flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-text-muted-dark mt-2">
                          Unlocks on: {new Date(capsule.unlockDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold mt-4 inline-block px-3 py-1 rounded-full text-gray-700 dark:text-text-muted-dark bg-gray-100 dark:bg-white/10">
                          {formatCountdown(capsule.unlockDate)}
                        </p>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-text-main-dark">Your Vault is Empty</h2>
                <p className="mt-2 text-gray-500 dark:text-text-muted-dark">Time to send a message to your future self.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}