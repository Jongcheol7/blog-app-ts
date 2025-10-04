"use client";
import { useEffect, useState } from "react";
import { useMobileStore } from "@/store/useMobileStore";
import { Search } from "lucide-react";
import HeaderLogo from "./HeaderLogo";
import HeaderMobileNav from "./HeaderMobileNav";
import HeaderDesktopNav from "./HeaderDesktopNav";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, setIsMobile } = useMobileStore();

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
      className={`flex items-center  px-1 py-4 pb-10 ${
        isMobile ? "justify-center" : "justify-between"
      }`}
    >
      <HeaderLogo />

      {/* <SearchGroup /> */}
      {!isMobile && <HeaderDesktopNav />}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-4 right-6 text-2xl font-bold z-50"
        >
          {isMenuOpen ? "✖️" : "☰"}
        </button>
      )}
      {isMobile && isMenuOpen && <HeaderMobileNav />}
    </header>
  );
}
