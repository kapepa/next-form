import { z } from "zod"
import { Id } from "../../../convex/_generated/dataModel"

export const profileSchema = z.object({
  _id: z.custom<Id<"user">>(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  role: z.enum(["admin", "user"]).default("user"),
  avatar: z.union([z.instanceof(File), z.string()]).optional(),
  password: z.string().optional(), // Password is optional
  newPassword: z.string().optional(), // New password is optional
  confirmPassword: z.string().optional(), // Confirm password is optional
}).refine(
  (data) => {
    // If password is provided, newPassword and confirmPassword are required
    if (data.password) {
      return !!data.newPassword && !!data.confirmPassword;
    }
    return true;
  },
  {
    message: "New password and confirm password are required when changing password",
    path: ["newPassword"], // Highlight the newPassword field if validation fails
  }
).refine(
  (data) => {
    // If newPassword is provided, it must match confirmPassword
    if (data.newPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  },
  {
    message: "New password and confirm password must match",
    path: ["confirmPassword"], // Highlight the confirmPassword field if validation fails
  }
);

export type ProfileRoleList = z.infer<typeof profileSchema>["role"];