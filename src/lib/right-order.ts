function rightOrder<T>(formData: FormData): { post: T; images: File[] } {
  const data: Partial<T> = {};
  const images: File[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("images[")) {
      images.push(value as File);
    } else {
      data[key as keyof T] = value as any
    }
  }

  return { post: data as T, images };
}

export { rightOrder };