"use client";
import { useEffect, useState } from "react";
import { useMobileStore } from "@/store/useMobileStore";
import HeaderLogo from "./HeaderLogo";
import HeaderMobileNav from "./HeaderMobileNav";
import HeaderDesktopNav from "./HeaderDesktopNav";
import { Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SearchGroup from "./SearchGroup";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, setIsMobile } = useMobileStore();
  const [searchClick, setSearchClick] = useState(false);

  // window 사이즈를 통한 상태변경
  useEffect(() => {
    const updateMobileDisplay = () => {
      if (window.innerWidth < 800) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    // 초기실행
    updateMobileDisplay();
    // 리스너 등록
    window.addEventListener("resize", updateMobileDisplay);
    // 클린업
    return () => window.removeEventListener("resize", updateMobileDisplay);
  }, [setIsMobile]);

  return (
    <header
      className={`relative flex items-center  px-1 py-4 pb-10 ${
        isMobile ? "justify-center" : "justify-between"
      }`}
    >
      <HeaderLogo />

      {!isMobile && <HeaderDesktopNav />}
      {isMobile && (
        <div className="absolute flex  gap-1 right-2 items-center text-2xl font-bold z-50 cursor-pointer">
          <Search
            className="mt-1"
            onClick={() => setSearchClick(!searchClick)}
          />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
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
