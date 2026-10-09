import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/** The white rounded box with a light-grey outline used in the right-hand panel. */
export default function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border-2 border-swan bg-white p-4", className)} {...rest} />;
}