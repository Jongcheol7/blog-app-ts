import BlogDetails from "@/modules/blog/BlogDetails";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // ✅ 이제 이렇게 해야 함!
  return <BlogDetails id={id} />;
}
