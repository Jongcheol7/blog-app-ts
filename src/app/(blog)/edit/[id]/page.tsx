import BlogEditForm from "@/modules/blog/BlogEditForm";
import BlogWriteForm from "@/modules/blog/BlogWriteForm";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogWriteForm id={id} />;
}
