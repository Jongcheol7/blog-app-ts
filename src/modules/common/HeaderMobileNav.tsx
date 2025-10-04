import Link from "next/link";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  setIsMenuOpen: (val: boolean) => void;
};

export default function HeaderMobileNav({ setIsMenuOpen }: Props) {
  const { data: session } = useSession();
  // 세션값 가져와서 관리자 여부인지, 세션이 있는지 판단
  const isAdmin = session?.user?.isAdmin;
  const isUser = !!session?.user;

  return (
    <>
      <motion.div
        className="flex fixed z-50 bg-gray-200 inset-0 justify-center items-center
        text-xl font-bold "
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div
          className="flex flex-col gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
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
          <NavLink href="/guestbook">Guestbook</NavLink>
          <NavLink href="/about">About</NavLink>
          {isAdmin && <NavLink href="/manager">Manager</NavLink>}
          {isAdmin && <NavLink href="/write">Write</NavLink>}
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
        </div>

        <motion.div
          className="fixed top-10 right-10 z-50 font-bold text-xl"
          initial={{ x: 0 }}
          animate={{ x: "100%" }}
          exit={{ x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={30} strokeWidth={2.5} />
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}
