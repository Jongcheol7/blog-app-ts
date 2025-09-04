"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMobileStore } from "@/store/useMobileStore";
import { LogIn, LogOut } from "lucide-react";
import { useFromStore } from "@/store/useFromStore";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, setIsMobile } = useMobileStore();
  const { setFrom } = useFromStore();

  // 창크기에 따른 인기글 보여주는 갯수 조절하기.
  useEffect(() => {
    const updateMobileDisplay = () => {
      if (window.innerWidth < 800) {
        setIsMobile(true); //모바일
      } else {
        setIsMobile(false);
      }
    };
    updateMobileDisplay();
    window.addEventListener("resize", updateMobileDisplay);
    return () => window.addEventListener("resize", updateMobileDisplay);
  }, [setIsMobile]);

  // 세션값 가져와서 관리자 여부인지, 세션이 있는지 판단
  const isAdmin = session?.user.isAdmin;
  const isUser = session?.user === null ? false : true;

  return (
    <header
      className={`flex items-center  px-1 py-4 pb-10 ${
        isMobile ? "justify-center" : "justify-between"
      }`}
    >
      <NavLink href={"/"}>
        <p className="text-3xl font-bold">Jongcheol Lee</p>
      </NavLink>

      <div className="flex gap-1">
        <Input
          className="w-[200px]"
          type="text"
          placeholder="검색어를 입력하세요"
        />
        <Link
          href={"/write"}
          className="bg-gray-400 hover:bg-gray-600 transition-all text-gray-100 px-2 py-1 rounded-md text-center"
        >
          새글추가
        </Link>
      </div>

      {!isMobile && (
        <nav className="flex gap-4 items-center">
          <ul className="flex gap-5 text-lg font-semibold">
            {isUser && (
              <li>
                <p>
                  {session?.user.name}
                  <Link href={"/nickname"} className="hover:text-green-800">
                    ⚙️
                  </Link>{" "}
                  님
                </p>
              </li>
            )}
            <li>
              <NavLink href="/blog">Blog</NavLink>
            </li>
            <li>
              <NavLink href="/guestbook">Guestbook</NavLink>
            </li>
            <li>
              <NavLink href="/about">About</NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink href="/manager">Manager</NavLink>
              </li>
            )}

            {/* 로그아웃시 서버에서는 잘 로그아웃이 되지만 클라이언트에서는 그걸 감지하지 못함
          따라서 Link 가 아닌 button 으로 강제적으로 리다이렉션 시켜줌. */}
            <li>
              <button
                onClick={async () => {
                  if (session?.user) {
                    await signOut();
                  } else {
                    await signIn();
                  }
                }}
                className="text-left w-fit hover:text-blue-800 transition duration-300"
              >
                {session ? (
                  <div className="flex gap-2">
                    <LogOut />
                    <span>로그아웃</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <LogIn />
                    <span>로그인</span>
                  </div>
                )}
              </button>
            </li>
          </ul>
        </nav>
      )}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-4 right-6 text-2xl font-bold z-50"
        >
          {isMenuOpen ? "✖️" : "☰"}
        </button>
      )}
      {isMobile && isMenuOpen && (
        <nav className="mt-4 space-y-2 text-center text-lg font-medium flex flex-col">
          {isUser && (
            <p>
              {session?.user.name}
              <Link href="/nickname" className="hover:text-green-800">
                ⚙️
              </Link>{" "}
              님
            </p>
          )}
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/guest">Guestbook</NavLink>
          <NavLink href="/about">About</NavLink>
          {isAdmin && <NavLink href="/manager">Manager</NavLink>}
          <button
            onClick={async () => {
              if (session?.user) {
                await signOut();
              } else {
                await signIn();
              }
            }}
            className="text-left w-fit hover:text-blue-800 transition duration-300"
          >
            {session ? (
              <div className="flex gap-2">
                <LogOut />
                <span>로그아웃</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <LogIn />
                <span>로그인</span>
              </div>
            )}
          </button>
        </nav>
      )}
    </header>
  );
}
