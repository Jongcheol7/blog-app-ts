"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  setSearchClick: (val: boolean) => void;
};

export default function SearchGroup({ setSearchClick }: Props) {
  const { keyword, setKeyword } = useSearchStore();
  const keywordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (keyword === "") {
      if (keywordRef.current) keywordRef.current.value = "";
    }
  }, [keyword]);

  useEffect(() => {
    keywordRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchClick(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSearchClick]);

  const handleSearch = () => {
    setKeyword(keywordRef.current?.value || "");
    setSearchClick(false);
  };

  return (
    <motion.div>
      <motion.div
        className="fixed z-50 left-1/2 -translate-x-1/2 top-[20%] w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent text-base placeholder:text-muted-foreground focus:outline-none font-normal"
            type="text"
            placeholder="Search posts..."
            ref={keywordRef}
            defaultValue={keyword}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-[11px]">Enter</kbd> to search, <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-[11px]">Esc</kbd> to close
        </div>
      </motion.div>
      <motion.div
        className="fixed z-40 inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setSearchClick(false)}
      />
    </motion.div>
  );
}
