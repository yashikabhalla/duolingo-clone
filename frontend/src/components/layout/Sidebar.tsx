"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import { NAV_ITEMS } from "./navItems";

export default function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("duolingo-theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleDarkMode() {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("duolingo-theme", next ? "dark" : "light");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] flex-col border-r-2 border-swan bg-white px-4 lg:flex dark:border-[#333] dark:bg-[#202020]">
      <Link
        href="/learn"
        className="px-4 pb-4 pt-6 text-[32px] font-black lowercase tracking-tight text-feather"
      >
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
                  ? "border-ice-border bg-ice text-macaw dark:border-[#315b70] dark:bg-[#243b47] dark:text-[#58ccff]"
                  : "border-transparent text-wolf hover:bg-polar dark:text-[#bdbdbd] dark:hover:bg-[#2b2b2b]",
              )}
            >
              <span className="w-8 text-center text-2xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pb-6">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-4 rounded-xl border-2 border-transparent px-3 py-2.5 text-left text-[15px] font-extrabold uppercase tracking-wider text-wolf transition hover:bg-polar dark:text-[#bdbdbd] dark:hover:bg-[#2b2b2b]"
        >
          <span className="w-8 text-center text-2xl" aria-hidden="true">
            {dark ? "☀️" : "🌙"}
          </span>

          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}