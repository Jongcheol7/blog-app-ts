import BlogDetails from "@/modules/blog/BlogDetails";

// 'props' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다. (ts(7006)) 오류 해결
export default async function Page(props: any) {
  // Next.js 빌드/런타임 충돌을 해결하는 가장 안전한 코드
  // 1. await로 런타임 에러(sync-dynamic-apis) 방지
  // 2. Promise 또는 객체 타입으로 타입 캐스팅하여 빌드 에러 방지
  const params = await (props.params as
    | Promise<{ id: string }>
    | { id: string });

  // 구조 분해 할당
  const { id } = params;

  return <BlogDetails id={id} />;
}
