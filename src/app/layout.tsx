import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Member Profiles",
  description:
    "Add members, upload photos, pick a template and download profile pages as a PDF.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Light theme only: HeroUI switches to dark solely via class/data-theme.
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} light h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
