import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "ECSA | PCET NMIET",
  description: "Electronics & Computer Students Association - Create | Connect | Build",
};

import { ScrollStoryProvider } from "@/components/scroll-story/ScrollStoryContext";
import AnimatedProcessorBackground from "@/components/layout/AnimatedProcessorBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-navy-900 text-white overflow-x-hidden flex flex-col min-h-screen`}>
        <RealtimeProvider>
          <ToastProvider>
            <ScrollStoryProvider>
              <CustomCursor />
              <AnimatedProcessorBackground />
              <Navbar />
              <main className="relative z-10 flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
            </ScrollStoryProvider>
          </ToastProvider>
        </RealtimeProvider>
      </body>
    </html>
  );
}
