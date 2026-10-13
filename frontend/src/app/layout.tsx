import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/Toast";
//Provides the toast/notification functionality
import { UserProvider } from "@/context/UserContext";
//Provides user-related data to components throughout the application.

import "./globals.css";

// Nunito is the closest free match to Duolingo's rounded font.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Duolingo Clone - Learn Spanish",
  description: "A Duolingo-style language learning app",
};
//root layout loads the Nunito font and global CSS and wraps the application with ToastProvider and UserProvider,
//so toast notifications and user state are available throughout the app
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
