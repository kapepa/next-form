import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL
    console.log("User ID:", id);

    // Parse the form data
    const formData = await req.formData();
    console.log("formData", formData)
    const file = formData.get("avatar") as File | null;

    if (!file) throw new Error("No file uploaded");

    // Save the file to the `public/uploads` directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true }); // Create the directory if it doesn't exist

    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const avatarUrl = `/uploads/${path.basename(filePath)}`; // Relative path for the avatar URL
    console.log("Avatar URL:", avatarUrl);

    // Example database function
    // await updateUserAvatar(id, avatarUrl);

    return NextResponse.json(
      { success: true, avatarUrl },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
