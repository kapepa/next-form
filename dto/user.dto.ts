import { Doc } from "../convex/_generated/dataModel";

type User = Doc<"user">;

export type UserDtoType = Omit<User, "password" | "_creationTime">
