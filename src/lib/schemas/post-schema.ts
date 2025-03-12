import { z } from "zod";

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Expected a file",
}).refine((file) => file.size <= 5 * 1024 * 1024, {
  message: "File size must be less than 5MB",
}).refine((file) => file.type.startsWith("image/"), {
  message: "Only image files are allowed",
});

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  images: z.array(fileSchema), // Use the custom file schema
  content: z.string().min(1, "Content is required"),
});