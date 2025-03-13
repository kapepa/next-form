export function formData<T extends Record<string, any>>(obj: T): FormData {
  const form = new FormData();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value: any = obj[key];

      if (value instanceof File) {
        form.append(key, value);
      }
      else if (Array.isArray(value)) {
        value.forEach((item: any, index: number) => {
          form.append(`${key}[${index}]`, item);
        });
      }
      else if (typeof value === "object" && value !== null) {
        for (const nestedKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, nestedKey)) {
            form.append(`${key}[${nestedKey}]`, value[nestedKey]);
          }
        }
      }
      else {
        form.append(key, String(value));
      }
    }
  }

  return form;
}