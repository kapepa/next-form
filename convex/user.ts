import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserByEmail = query({
  args: {
    email: v.string(), // Email is a required string argument
  },
  handler: async (ctx, args) => {
    // Query the "users" table for a user with the given email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    return user;
  },
});