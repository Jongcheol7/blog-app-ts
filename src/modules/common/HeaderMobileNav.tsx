import Link from "next/link";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export default function HeaderMobileNav() {
  const { data: session } = useSession();
  // 세션값 가져와서 관리자 여부인지, 세션이 있는지 판단
  const isAdmin = session?.user.isAdmin;
  const isUser = session?.user === null ? false : true;

  return (
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
  );
}
