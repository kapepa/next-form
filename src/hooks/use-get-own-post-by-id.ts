import { fetchQuery } from "convex/nextjs";
import { useProfileMyselfServer } from "./use-profile-myself-server"
import { api } from "../../convex/_generated/api";
import { Routers } from "@/types/routers";
import { redirect } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useGetOwnPostById = async (postId: string) => {
  const { profile } = await useProfileMyselfServer();
  const post = profile._id
    ? await fetchQuery(api.post.getPostsByIdAndUserById, { _id: postId as Id<"post">, authorId: profile._id })
    : null;

  if (!post) redirect(Routers.Home);

  return { post };
}
