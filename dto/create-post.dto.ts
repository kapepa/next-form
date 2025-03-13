import { Doc, Id } from "../convex/_generated/dataModel";

type Post = Doc<"post">
type CreatePost = Pick<Post, "content" | "title">

export interface ICreatePostDto extends CreatePost {
  authorId?: Id<"user">
  images?: string[]
}