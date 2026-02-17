import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import the fonts
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingFeedbackButton } from "@/components/floating-feedback-button";

// Configure the fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "The Goal Time Capsule",
  description: "Send a message to your future self.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning to prevent errors from next-themes
    <html lang="en" suppressHydrationWarning>
      <head />
      {/* Apply font variables to the body so Tailwind can use them */}
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class" // This is critical for Tailwind dark mode
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FloatingFeedbackButton />
        </ThemeProvider>
      </body>
    </html>
  );
}