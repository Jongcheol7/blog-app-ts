import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link href="/">
      <p className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200">
        Jongcheol Lee
      </p>
    </Link>
  );
}
