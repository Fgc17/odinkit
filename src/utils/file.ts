export async function fileFromUrl(
  url: string,
  fileName: string = "file"
): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}
