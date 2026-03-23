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
    <nav className="flex items-center gap-1">
      <div className="flex items-center gap-1 text-sm font-medium">
        <button
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          onClick={() => setSearchClick(!searchClick)}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/guestbook">Guestbook</NavLink>
        <NavLink href="/about">About</NavLink>
        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
        {isAdmin && <NavLink href="/write">Write</NavLink>}

        <button
          onClick={async () => {
            if (session?.user) {
              await signOut();
            } else {
              await signIn();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 cursor-pointer"
        >
          {session ? (
            <>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
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
