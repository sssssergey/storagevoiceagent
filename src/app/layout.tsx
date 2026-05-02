import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConvaiWidget from "@/components/ConvaiWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crown Storage — Storage that gets out of your way",
  description:
    "Climate-controlled storage units, 24/7 gated access, and a real person on call. Talk to our AI assistant to get a unit picked for you in under 5 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm text-ink">
        {children}
        <ConvaiWidget />
      </body>
    </html>
  );
}
