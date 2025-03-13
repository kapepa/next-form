function rightOrder<T>(formData: { [key: string]: any }): { post: T; images: File[] } {
  const data: Partial<T> = {};
  const images: File[] = [];
  // const entries = Object.entries(formData.FormData)

  console.log(formData.title)

  for (const [key, value] of Object.entries(formData)) {

    // if (key.startsWith("images[")) {
    //   images.push(value);
    // } else {
    //   data[key as keyof T] = value;
    // }
  }

  // console.log(formData)
  return { post: data as T, images };
}

export { rightOrder };