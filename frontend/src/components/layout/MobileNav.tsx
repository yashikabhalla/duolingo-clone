"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import { NAV_ITEMS } from "./navItems";

/** Bottom tab bar shown instead of the sidebar on phones and tablets. */
export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t-2 border-swan bg-white px-2 py-1.5 lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl",
              active ? "border-ice-border bg-ice" : "border-transparent",
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}