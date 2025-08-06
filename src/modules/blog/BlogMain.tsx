import Link from "next/link";

export default function BlogMain() {
  return (
    <div>
      <Link href={"/write"}>글쓰기</Link>
    </div>
  );
}
