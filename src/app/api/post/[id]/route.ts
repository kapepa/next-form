"use server"

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
// import { api } from "../../../../convex/_generated/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rightOrder } from "@/lib/right-order";
import { deleteFile, writeFiles } from "@/lib/files-worker";
import { ICreatePostDto } from "../../../../../dto/create-post.dto";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { actualDifference } from "@/lib/difference-actual";

// import { Id } from "../../../../convex/_generated/dataModel";

interface Params {
  id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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

    const existingPost = await fetchQuery(api.post.getPostById, { id: id as Id<"post"> });
    const { actual, difference } = actualDifference(existingPost!.images, urls);

    if (!!difference?.length) {
      await deleteFile(difference);
    }

    // Handle image uploads
    let imageUrls: string[] = [];
    if (images.length) {
      imageUrls = await writeFiles({ files: images, folder: "posts" });
      imageUrls.concat(actual)
    }

    // Prepare the post data for the mutation
    const postData = {
      title: post.title,       // Required
      content: post.content,   // Required
      images: imageUrls,       // Required (array of strings)
      authorId: user.id as Id<"user">, // Required
      _id: existingPost!._id,
    };

    // Call the Convex mutation to update the post
    const createPost = await fetchMutation(api.post.updatePost, postData);

    return NextResponse.json(
      { success: true, postId: createPost?._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

