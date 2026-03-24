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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateMobileDisplay = () => {
      setIsMobile(window.innerWidth < 800);
    };
    updateMobileDisplay();
    window.addEventListener("resize", updateMobileDisplay);
    return () => window.removeEventListener("resize", updateMobileDisplay);
  }, [setIsMobile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-3 z-40 flex items-center justify-between px-5 py-3 mb-8 rounded-2xl transition-supanova ${
        scrolled
          ? "glass-nav"
          : "bg-transparent"
      }`}
    >
      <HeaderLogo />

      {!isMobile && <HeaderDesktopNav />}

      {isMobile && (
        <div className="flex items-center gap-1">
          <button
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-supanova cursor-pointer"
            onClick={() => setSearchClick(!searchClick)}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-supanova cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-[18px] h-[18px]" />
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
