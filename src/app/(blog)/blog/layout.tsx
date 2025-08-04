type Props = {
  blog: React.ReactNode;
  hotblog: React.ReactNode;
};

export default function BlogLayout({ blog, hotblog }: Props) {
  console.log("블로그 루트 레이아웃");
  return (
    <div>
      <div className="px-4 mb-7">{hotblog}</div>
      <div>{blog}</div>
    </div>
  );
}
