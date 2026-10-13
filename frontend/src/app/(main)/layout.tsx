"use client";
import type { ReactNode } from "react";//ReactNode is a TypeScript type representing something React can render.
import { usePathname } from "next/navigation";

import MobileNav from "@/components/layout/MobileNav";
import RightPanel from "@/components/layout/RightPanel";
import Sidebar from "@/components/layout/Sidebar";
import StatsBar from "@/components/layout/StatsBar";

export default function MainLayout({ children }: { children: ReactNode }) {//children can contain React-renderable content
  const pathname = usePathname();//gets the current URL pathname
  const isCoursesPage = pathname === "/courses";//boolean if it is course page or not because it has different layout

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="lg:pl-[256px]">
        <div
          className={
            isCoursesPage
              ? "mx-auto px-4 pb-24 pt-4 lg:px-10 lg:pb-10 lg:pt-8"//coursepage styling
              : "mx-auto flex max-w-[1056px] gap-12 px-4 pb-24 pt-4 lg:px-6 lg:pb-10 lg:pt-6"//normal styling
          }
        >
          <main className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <StatsBar />
            </div>

            {children}
          </main>

          {!isCoursesPage && (
            <aside className="hidden w-[368px] shrink-0 lg:block">
              <div className="sticky top-6">
                <RightPanel />
              </div>
            </aside>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
