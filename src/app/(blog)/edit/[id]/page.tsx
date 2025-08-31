import BlogForm from "@/modules/blog/BlogForm";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogForm id={id} />;
}
