import BlogEditForm from "@/modules/blog/BlogEditForm";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogEditForm id={id} />;
}
