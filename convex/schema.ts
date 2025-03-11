import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    email: v.string(),
    avatar: v.optional(v.string()),
    password: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),
});