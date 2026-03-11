import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { TooltipProvider } from "@/components/ui/tooltip";
import AuthInitializer from "@/components/AuthInitializer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HireLoop | Secure AI-Powered Hiring Platform",
  description:
    "Next-generation hiring platform with AI-driven CV scoring and seamless HR-Candidate workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", raleway.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <TooltipProvider>
            <AuthInitializer>
              {children}
              <Toaster richColors position="top-right" />
            </AuthInitializer>
          </TooltipProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
