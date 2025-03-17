import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const numItems = Number(searchParams.get("numItems")) || 10; // Default to 10 if not provided
  const cursor = searchParams.get("cursor") || undefined; // Can be null

  // Fetch posts from Convex
  const result = await fetchQuery(api.post.getPosts, { numItems, cursor });

  return NextResponse.json(result);
}