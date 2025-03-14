import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rightOrder } from "@/lib/right-order";
import { writeFiles } from "@/lib/files-worker";
import { ICreatePostDto } from "../../../../dto/create-post.dto";
import { Id } from "../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Session user not found" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const existUser = await fetchQuery(api.user.getUserById, { id: user.id });
    if (!existUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    const { post, images } = rightOrder<ICreatePostDto>(formData);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Invalid post data" },
        { status: 400 }
      );
    }

    // Handle image uploads
    let imageUrls: string[] = [];
    if (images.length) {
      imageUrls = await writeFiles({ files: images, folder: "posts" });
    }

    // Prepare the post data for the mutation
    const postData = {
      title: post.title,       // Required
      content: post.content,   // Required
      images: imageUrls,       // Required (array of strings)
      authorId: user.id as Id<"user">, // Required
    };

    // Call the Convex mutation to create the post
    const createPost = await fetchMutation(api.post.createPost, postData);

    return NextResponse.json(
      { success: true, postId: createPost },
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