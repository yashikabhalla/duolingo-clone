import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/Toast";
import { UserProvider } from "@/context/UserContext";

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