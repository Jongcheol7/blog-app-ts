import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const { setFrom } = useFromStore();
  const { setKeyword, setCategory } = useSearchStore();
  const path = usePathname();
  console.log("navlink path : ", path);
  useEffect(() => {
    setFrom(path);
  }, [path, setFrom]);

  return (
    <Link
      href={href}
      onClick={() => {
        if (path === "/" || path === "/blog") {
          setKeyword("");
          setCategory(0);
        }
      }}
      className={`text-gray-600 ${
        href === path ? "font-black text-[25px]" : ""
      } hover:`}
    >
      {children}
    </Link>
  );
}
