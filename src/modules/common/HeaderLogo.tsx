import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm tracking-tight transition-transform duration-300 group-hover:scale-105">
        JC
      </div>
      <p className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-200">
        Jongcheol Lee
      </p>
    </Link>
  );
}
