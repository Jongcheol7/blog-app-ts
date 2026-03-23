"use client";

import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, X } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/common/ThemeToggle";

type Props = {
  setIsMenuOpen: (val: boolean) => void;
};

export default function HeaderMobileNav({ setIsMenuOpen }: Props) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const isUser = !!session?.user;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Close button */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
      >
        <X className="w-6 h-6 text-foreground" />
      </button>

      <div
        className="flex flex-col items-center gap-2 text-2xl font-light"
        onClick={() => setIsMenuOpen(false)}
      >
        {isUser && (
          <p className="text-sm text-muted-foreground mb-4">
            {session?.user.name}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <NavLink href="/blog">Blog</NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NavLink href="/guestbook">Guestbook</NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <NavLink href="/about">About</NavLink>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NavLink href="/admin">Admin</NavLink>
          </motion.div>
        )}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <NavLink href="/write">Write</NavLink>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <button
            onClick={async () => {
              if (session?.user) {
                await signOut();
              } else {
                await signIn();
              }
            }}
            className="flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {session ? (
              <>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-2"
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.div>
  );
}
