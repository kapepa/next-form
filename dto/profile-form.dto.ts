import { Doc } from "../convex/_generated/dataModel";

type User = Doc<"user">;
type UserDto = Omit<User, "_creationTime">

export interface IProfileFormDto extends UserDto {
  newPassword?: string,
  confirmPassword?: string,
}