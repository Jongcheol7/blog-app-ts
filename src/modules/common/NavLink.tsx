import { useFromStore } from "@/store/useFromStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const { setFrom } = useFromStore();
  const path = usePathname();
  console.log("navlink path : ", path);
  useEffect(() => {
    setFrom(path);
  }, [path, setFrom]);

  return (
    <Link
      href={href}
      className={`${
        href === path ? "text-green-800" : ""
      } hover:text-green-800`}
    >
      {children}
    </Link>
  );
}
