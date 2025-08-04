import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const path = usePathname();
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
