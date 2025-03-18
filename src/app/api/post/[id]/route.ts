import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rightOrder } from "@/lib/right-order";
import { deleteFile, writeFiles } from "@/lib/files-worker";
import { ICreatePostDto } from "../../../../../dto/create-post.dto";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { actualDifference } from "@/lib/difference-actual";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Session user not found" },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    const { post, images, urls } = rightOrder<ICreatePostDto>(formData);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Invalid post data" },
        { status: 400 }
      );
    }

    // Fetch the existing post
    const existingPost = await fetchQuery(api.post.getPostById, { id: id as Id<"post"> });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Calculate the difference between current and new URLs
    const { actual, difference } = actualDifference(existingPost.images, urls);

    // Delete files that are no longer needed
    if (difference.length > 0) {
      await deleteFile(difference);
    }

    // Handle image uploads
    let imageUrls: string[] = [];
    if (images.length > 0) {
      imageUrls = await writeFiles({ files: images, folder: "posts" });
    }

    // Combine new image URLs with existing ones
    const updatedImageUrls = [...imageUrls, ...actual];

    console.log(updatedImageUrls)

    // Prepare the post data for the mutation
    const postData = {
      title: post.title,       // Required
      content: post.content,   // Required
      images: updatedImageUrls, // Updated image URLs
      authorId: user.id as Id<"user">, // Required
      _id: existingPost._id,
    };

    // Call the Convex mutation to update the post
    const updatedPost = await fetchMutation(api.post.updatePost, postData);

    return NextResponse.json(
      { success: true, postId: updatedPost!._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}