import { fetchQuery } from "convex/nextjs"
import { api } from "../../convex/_generated/api"
import { Doc } from "../../convex/_generated/dataModel"

export async function useGetPostsServer(): Promise<{ posts: Doc<"post">[], nextCursor: string }> {
  return await fetchQuery(api.post.getPosts, {})
}