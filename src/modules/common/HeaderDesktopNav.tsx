"use client";

import { LogIn, LogOut, Search } from "lucide-react";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SearchGroup from "./SearchGroup";
import { AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function HeaderDesktopNav() {
  const [searchClick, setSearchClick] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;

  return (
    <nav className="flex items-center gap-0.5">
      <div className="flex items-center gap-0.5 text-[13px] font-medium">
        <button
          className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-supanova cursor-pointer"
          onClick={() => setSearchClick(!searchClick)}
        >
          <Search className="w-[16px] h-[16px]" />
        </button>

        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/guestbook">Guestbook</NavLink>
        <NavLink href="/about">About</NavLink>
        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
        {isAdmin && <NavLink href="/write">Write</NavLink>}

        <div className="w-px h-4 bg-border/60 mx-2" />

        <button
          onClick={async () => {
            if (session?.user) {
              await signOut();
            } else {
              await signIn();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-supanova cursor-pointer"
        >
          {session ? (
            <>
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </>
          )}
        </button>

        <ThemeToggle />
      </div>

      <AnimatePresence>
        {searchClick && <SearchGroup setSearchClick={setSearchClick} />}
      </AnimatePresence>
    </nav>
  );
}
