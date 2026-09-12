import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/layout/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import BackgroundCanvas from "@/components/3d/BackgroundCanvas";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "ECSA | PCET NMIET",
  description: "Electronics & Computer Students Association - Create | Connect | Build",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-navy-900 text-white overflow-x-hidden`}>
        <LenisProvider>
          <CustomCursor />
          {/* 3D Global Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <BackgroundCanvas />
          </div>
          {/* Main Content */}
          <Navbar />
          <main className="relative z-10 flex min-h-screen flex-col">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
