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

  post: defineTable({
    title: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    authorId: v.id("user"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_authorId", ["authorId"])
    .index("by_createdAt", ["createdAt"]),
});