import type { ReactNode } from "react";

import MobileNav from "@/components/layout/MobileNav";
import RightPanel from "@/components/layout/RightPanel";
import Sidebar from "@/components/layout/Sidebar";
import StatsBar from "@/components/layout/StatsBar";

/** Shell for every normal page: sidebar | content | right panel.
 *  The lesson player lives OUTSIDE this group because it is full-screen. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-[256px]">
        <div className="mx-auto flex max-w-[1056px] gap-12 px-4 pb-24 pt-4 lg:px-6 lg:pb-10 lg:pt-6">
          <main className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <StatsBar />
            </div>
            {children}
          </main>
          <aside className="hidden w-[368px] shrink-0 lg:block">
            <div className="sticky top-6">
              <RightPanel />
            </div>
          </aside>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}