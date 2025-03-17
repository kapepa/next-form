import { useGetPostsServer } from "@/hooks/use-get-posts-server";
import { PostsList } from "./component/posts-list";

export default async function Home() {
  const { posts, nextCursor } = await useGetPostsServer();

  return (
    <div
      className="grow flex justify-center items-center"
    >
      <PostsList
        initialPosts={posts}
        initialCursor={nextCursor}
      />
    </div>
  );
}
