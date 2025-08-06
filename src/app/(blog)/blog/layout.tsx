export default function Layout({
  blog,
  hotblog,
}: {
  blog: React.ReactNode;
  hotblog: React.ReactNode;
}) {
  return (
    <div>
      <section>{hotblog}</section>
      <section>{blog}</section>
    </div>
  );
}
