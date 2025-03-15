import { z } from "zod";

// Custom schema for validating files
const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Expected a file",
}).refine((file) => file.size <= 5 * 1024 * 1024, { // 5MB in bytes
  message: "File size must be less than 5MB",
}).refine((file) => file.type.startsWith("image/"), {
  message: "Only image files are allowed",
});

// Schema for the post
export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  images: z.array(
    z.union([
      fileSchema, // Accepts File objects
      z.string().min(1, "File path or URL is required"), // Accepts any non-empty string
    ])
  ),
  content: z.string().min(1, "Content is required"),
});