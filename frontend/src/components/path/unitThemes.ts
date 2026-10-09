export interface UnitTheme {
  banner: string; // unit header background
  bannerShadow: string; // its 3D bottom edge
  node: string; // "available" node + popover background
  nodeShadow: string; // node's 3D bottom edge
  text: string; // text colour that matches the theme (START bubble, popover button)
  ring: string; // progress-ring colour (hex, used inside SVG)
}

// Duolingo changes colour from unit to unit. Class names are written out in full so
// Tailwind can find them (it cannot see classes built from string pieces).
const THEMES: UnitTheme[] = [
  {
    banner: "bg-feather",
    bannerShadow: "shadow-[0_4px_0_#58a700]",
    node: "bg-feather",
    nodeShadow: "shadow-[0_8px_0_#58a700]",
    text: "text-feather",
    ring: "#58cc02",
  },
  {
    banner: "bg-macaw",
    bannerShadow: "shadow-[0_4px_0_#1899d6]",
    node: "bg-macaw",
    nodeShadow: "shadow-[0_8px_0_#1899d6]",
    text: "text-macaw",
    ring: "#1cb0f6",
  },
  {
    banner: "bg-beetle",
    bannerShadow: "shadow-[0_4px_0_#a568cc]",
    node: "bg-beetle",
    nodeShadow: "shadow-[0_8px_0_#a568cc]",
    text: "text-beetle",
    ring: "#ce82ff",
  },
  {
    banner: "bg-fox",
    bannerShadow: "shadow-[0_4px_0_#cc7900]",
    node: "bg-fox",
    nodeShadow: "shadow-[0_8px_0_#cc7900]",
    text: "text-fox",
    ring: "#ff9600",
  },
];

export const themeForUnit = (unitIndex: number): UnitTheme => THEMES[unitIndex % THEMES.length];