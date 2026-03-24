"use client";

import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const { setFrom } = useFromStore();
  const { setKeyword, setCategory } = useSearchStore();
  const path = usePathname();

  useEffect(() => {
    setFrom(path);
  }, [path, setFrom]);

  return (
    <Link
      href={href}
      onClick={() => {
        if (path === "/" || path === "/blog") {
          setKeyword("");
          setCategory(0);
        }
      }}
      className={cn(
        "px-3 py-2 rounded-xl text-muted-foreground transition-all duration-200",
        "hover:text-foreground hover:bg-accent",
        href === path && "text-foreground bg-accent font-semibold"
      )}
    >
      {children}
    </Link>
  );
}
