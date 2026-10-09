"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import { NAV_ITEMS } from "./navItems";

/** Left navigation (desktop only). The current page is highlighted in blue like Duolingo. */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] flex-col border-r-2 border-swan bg-white px-4 lg:flex">
      <Link href="/learn" className="px-4 pb-4 pt-6 text-[32px] font-black lowercase tracking-tight text-feather">
        duolingo
      </Link>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 px-3 py-2.5 text-[15px] font-extrabold uppercase tracking-wider",
                active
                  ? "border-ice-border bg-ice text-macaw"
                  : "border-transparent text-wolf hover:bg-polar",
              )}
            >
              <span className="w-8 text-center text-2xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}