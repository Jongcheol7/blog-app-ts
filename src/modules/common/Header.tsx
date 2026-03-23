"use client";
import { useEffect, useState } from "react";
import { useMobileStore } from "@/store/useMobileStore";
import HeaderLogo from "./HeaderLogo";
import HeaderMobileNav from "./HeaderMobileNav";
import HeaderDesktopNav from "./HeaderDesktopNav";
import { Search, Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SearchGroup from "./SearchGroup";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, setIsMobile } = useMobileStore();
  const [searchClick, setSearchClick] = useState(false);

  useEffect(() => {
    const updateMobileDisplay = () => {
      setIsMobile(window.innerWidth < 800);
    };
    updateMobileDisplay();
    window.addEventListener("resize", updateMobileDisplay);
    return () => window.removeEventListener("resize", updateMobileDisplay);
  }, [setIsMobile]);

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50 flex items-center justify-between px-4 py-3 mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <HeaderLogo />

      {!isMobile && <HeaderDesktopNav />}

      {isMobile && (
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setSearchClick(!searchClick)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <HeaderMobileNav setIsMenuOpen={setIsMenuOpen} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchClick && <SearchGroup setSearchClick={setSearchClick} />}
      </AnimatePresence>
    </header>
  );
}
