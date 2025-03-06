import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByEmail = query({
  args: {
    email: v.string(), // Email is a required string argument
  },
  handler: async (ctx, args) => {
    // Query the "users" table for a user with the given email
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
      const userId = await ctx.db.insert("user", args);

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