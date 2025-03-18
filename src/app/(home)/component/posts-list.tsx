"use client";

import { FC, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Post } from "./post";
import { Spinner } from "@/components/ui/spinner"; // Import a loading spinner
import axiosInstance from "@/lib/axios";

interface PostsListProps {
  initialPosts: Doc<"post">[]; // Initial posts fetched on the server
  initialCursor?: string; // Initial cursor for pagination
}

const PostsList: FC<PostsListProps> = ({ initialPosts, initialCursor }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use useInView to detect when the footer is in view
  const { ref: footerRef, inView } = useInView({
    threshold: 0, // Trigger when the footer is in view
  });

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // Build the URL with query parameters
      const url = `/api/posts?numItems=${posts.length}${cursor ? `&cursor=${cursor}` : ""}`;

      // Fetch more posts using axios
      const response = await axiosInstance.get(url);

      const { posts: newPosts, nextCursor } = response.data;

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setCursor(nextCursor);
      } else {
        setHasMore(false); // No more posts to load
      }
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetchMorePosts when the footer is in view
  useEffect(() => {
    if (inView && hasMore) {
      fetchMorePosts();
    }
  }, [inView, hasMore]);

  return (
    <div className="flex flex-col w-full">
      {/* Render posts */}
      {posts.map((post, index) => (
        <Post key={`${post._id}-${index}`} post={post} />
      ))}

      {/* Footer element to trigger infinite scroll */}
      <div ref={footerRef} className="w-full h-1"></div>

      {/* Loading spinner */}
      {isLoading && (
        <div
          className="flex justify-center items-center"
        >
          <Spinner className="mt-4" />
        </div>
      )}

      {/* No more posts message */}
      {!hasMore && (
        <p className="text-center text-muted-foreground mt-4">
          No more posts to load.
        </p>
      )}
    </div>
  );
};

export { PostsList };