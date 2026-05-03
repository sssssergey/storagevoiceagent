import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import ConvaiWidget from "@/components/ConvaiWidget";
import "./globals.css";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRW Storage — Storage in London, quietly done well.",
  description:
    "Climate-controlled storage in EC1, 24-hour gated access, and a real person on the line. Speak with our assistant to find the right room in five minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inconsolata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm text-ink">
        {children}
        <ConvaiWidget />
      </body>
    </html>
  );
}
