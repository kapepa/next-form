import { fetchQuery } from "convex/nextjs"
import { api } from "../../convex/_generated/api"
import { Doc, Id } from "../../convex/_generated/dataModel"

export async function useGetPostServer(id: string): Promise<Doc<"post">> {
  return await fetchQuery(api.post.getPost, { _id: id as Id<"post"> })
}