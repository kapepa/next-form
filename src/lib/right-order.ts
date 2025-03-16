function rightOrder<T>(formData: FormData): { post: T; images: File[], urls: string[] } {
  const data: Partial<T> = {};
  const images: File[] = [];
  const urls: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[")) {
      if (typeof value === "string") {
        urls.push(value)
      } else {
        images.push(value as File);
      }
    } else {
      data[key as keyof T] = value as any
    }
  }

  return { post: data as T, images, urls };
}

export { rightOrder };