import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByEmail = query({
  args: {
    email: v.string(), // Email is a required string argument
  },
  handler: async (ctx, args) => {
    // Query the "user" table for a user with the given email
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
    return user;
  },
});

export const createUser = mutation({
  args: { name: v.string(), email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    try {
      // Insert the new user into the database
      const userId = await ctx.db.insert("user", { ...args, role: "user" });

      // Fetch the newly created user by ID
      const user = await ctx.db.get(userId);

      if (!user) throw new Error("Failed to create user.");

      // Return the full user object
      return user;
    } catch (err) {
      console.error(err)
      return err
    }
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("user"),
    updates: v.object({
      _id: v.optional(v.id("user")),
      name: v.optional(v.string()),
      role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
      email: v.optional(v.string()),
      avatar: v.optional(v.string()),
      password: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    try {
      const { id, updates } = args;
      await ctx.db.patch(id, updates);

      const updatedUser = await ctx.db.get(id);
      if (updatedUser) {
        const { password, _creationTime, ...profile } = updatedUser;
        return profile
      }

      return updatedUser;
    } catch (err) {
      console.error(err)
      return err
    }
  }
})

export const getUserById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!!user) {
      const { password, _creationTime, ...profile } = user;
      return profile
    }

    return null;
  },
});

export const getProfileById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
  },
});