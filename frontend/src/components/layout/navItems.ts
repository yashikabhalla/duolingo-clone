export interface NavItem {
  href: string;
  label: string;
  icon: string; // emoji for now; swap for SVGs later without touching anything else
}

// Single source of truth: the desktop sidebar and the mobile bottom bar both read this list.
export const NAV_ITEMS: NavItem[] = [
  { href: "/learn", label: "Learn", icon: "🏠" },
  { href: "/leaderboard", label: "Leaderboards", icon: "🛡️" },
  { href: "/quests", label: "Quests", icon: "🎁" },
  { href: "/shop", label: "Shop", icon: "🏪" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/settings", label: "More", icon: "⚙️" },
];