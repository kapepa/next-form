import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    avatar: v.optional(v.string()),
    // Add other fields as needed
  }).index("by_email", ["email"]), // Index for faster lookups by email
});