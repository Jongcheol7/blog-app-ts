import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-bold">404</h2>
      <p className="text-muted-foreground">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/blog"
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        블로그로 돌아가기
      </Link>
    </div>
  );
}
