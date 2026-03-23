"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { List, ChevronDown } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type Props = {
  contentRef: React.RefObject<HTMLDivElement | null>;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function TableOfContents({ contentRef }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const elements = el.querySelectorAll("h1, h2, h3");
      const items: Heading[] = [];

      elements.forEach((heading, index) => {
        const text = heading.textContent || "";
        const id = slugify(text) || `heading-${index}`;
        heading.id = id;
        items.push({
          id,
          text,
          level: parseInt(heading.tagName[1]),
        });
      });

      setHeadings(items);
    }, 500);

    return () => clearTimeout(timer);
  }, [contentRef]);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Desktop */}
      <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          On this page
        </p>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => handleClick(h.id)}
                className={cn(
                  "block text-sm leading-snug transition-colors duration-150 text-left cursor-pointer",
                  h.level === 2 && "pl-3",
                  h.level === 3 && "pl-6",
                  activeId === h.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <List className="w-4 h-4" />
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <ul className="mt-3 space-y-1.5 pl-2 border-l-2 border-border">
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => {
                    handleClick(h.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "block text-sm leading-snug transition-colors text-left cursor-pointer",
                    h.level === 2 && "pl-3",
                    h.level === 3 && "pl-6",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
