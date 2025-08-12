export async function UrlToFile(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File([blob], filename, { type: blob.type });
  return file;
}
