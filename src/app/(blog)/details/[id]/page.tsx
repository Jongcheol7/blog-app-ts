import BlogDetails from "@/modules/blog/BlogDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogDetails id={id} />;
}
