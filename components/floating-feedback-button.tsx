"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export function FloatingFeedbackButton() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
            <a
                href={process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg px-4 py-3 rounded-full font-medium text-sm flex items-center gap-2 transition-transform hover:-translate-y-1"
            >
                <MessageSquare size={18} />
                Feedback
            </a>
            <button
                onClick={() => setIsVisible(false)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full shadow-sm transition-colors"
                aria-label="Close feedback button"
            >
                <X size={14} />
            </button>
        </div>
    );
}
