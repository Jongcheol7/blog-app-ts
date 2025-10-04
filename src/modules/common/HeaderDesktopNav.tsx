import { LogIn, LogOut, Search } from "lucide-react";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SearchGroup from "./SearchGroup";
import { AnimatePresence } from "framer-motion";

export default function HeaderDesktopNav() {
  const [searchClick, setSearchClick] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;

  return (
    <nav className="flex gap-4 items-center">
      <div className="flex items-center gap-5 text-lg font-semibold">
        <Search
          className="cursor-pointer"
          onClick={() => setSearchClick(!searchClick)}
        />
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/guestbook">Guestbook</NavLink>
        <NavLink href="/about">About</NavLink>
        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
        {isAdmin && <NavLink href="/write">Write</NavLink>}

        {/* 로그아웃시 서버에서는 잘 로그아웃이 되지만 클라이언트에서는 그걸 감지하지 못함
          따라서 Link 가 아닌 button 으로 강제적으로 리다이렉션 시켜줌. */}
        <button
          onClick={async () => {
            if (session?.user) {
              await signOut();
            } else {
              await signIn();
            }
          }}
          className="text-gray-600 hover:text-blue-800 transition duration-300 cursor-pointer"
        >
          {session ? (
            <div className="flex mt-1">
              <LogOut />
              <span className="">로그아웃</span>
            </div>
          ) : (
            <div className="flex mt-1">
              <LogIn />
              <span className="">로그인</span>
            </div>
          )}
        </button>
      </div>

      <AnimatePresence>
        {searchClick && <SearchGroup setSearchClick={setSearchClick} />}
      </AnimatePresence>
    </nav>
  );
}
