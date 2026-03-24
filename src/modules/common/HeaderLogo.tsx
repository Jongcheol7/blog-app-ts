import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center text-background text-xs font-bold tracking-tight transition-supanova group-hover:scale-105">
        JC
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Jongcheol Lee
      </span>
    </Link>
  );
}
