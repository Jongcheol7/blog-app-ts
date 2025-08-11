import BlogDetails from "@/modules/blog/BlogDetails";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;
  console.log("params : ", params);
  console.log("id : ", id);
  return <BlogDetails id={id} />;
}
