import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updatePost = mutation({
  args: {
    _id: v.id("post"),
    title: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    authorId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const { _id, ...other } = args;
    await ctx.db.patch(_id, other);
    return await ctx.db.get(_id);
  }
})

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    authorId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("post", {
      title: args.title,
      content: args.content,
      images: args.images,
      authorId: args.authorId,
      createdAt: Date.now(),
    });
    return postId;
  },
});

export const getPostById = query({
  args: {
    id: v.id("post"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    return post;
  },
});

export const getPostsByUserId = query({
  args: {
    authorId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("post")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .collect();
    return posts;
  },
});

export const getPostsWithAuthors = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("post").collect();
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author,
        };
      })
    );
    return postsWithAuthors;
  },
});

export const getPostsByIdAndUserById = query({
  args: {
    _id: v.id("post"),
    authorId: v.id("user"),
  },
  handler: async (ctx, args) => {
    // Fetch the post by its ID and authorId
    const post = await ctx.db
      .query("post")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .filter((q) => q.eq(q.field("_id"), args._id)) // Filter by post ID
      .unique(); // Ensure only one post is returned

    return post;
  },
});

export const getPosts = query({
  args: {
    numItems: v.optional(v.number()), // Number of posts to fetch
    cursor: v.optional(v.string()), // Cursor for pagination
  },
  handler: async (ctx, args) => {
    const { numItems = 10, cursor } = args;

    // Convert undefined cursor to null
    const paginationCursor = cursor ?? null;

    // Fetch posts with pagination
    const result = await ctx.db
      .query("post")
      .order("desc")
      .paginate({ numItems, cursor: paginationCursor });

    return {
      posts: result.page, // The current page of posts
      nextCursor: result.continueCursor, // Cursor for the next page
    };
  },
});