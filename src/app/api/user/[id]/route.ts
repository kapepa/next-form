import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { Id } from "../../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop() as Id<"user">;
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;


    if (id !== formData.get("_id")) throw "Invalid user ID";

    const userUpdate = await fetchQuery(api.user.getProfileById, { id })
    if (!userUpdate) throw "User not found";

    const fields: Record<string, string | File> = {};
    for (const [key, value] of formData.entries()) fields[key] = value;

    if (!!file) {
      if (!!userUpdate?.avatar) {
        const oldAvatarPath = path.join(process.cwd(), "public", userUpdate.avatar);
        await fs.unlink(oldAvatarPath);
      }
      const uploadDir = path.join(process.cwd(), "public/avatars");
      const extend = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${extend}`;
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      fields["avatar"] = `/avatars/${fileName}`;
    };

    if (fields["password"] && typeof fields["password"] === "string") {
      const password = fields["password"];
      const compare = await bcrypt.compare(password, userUpdate.password)
      if (!compare) throw "There's something wrong with the password"

      const hashPassword = await bcrypt.hash(fields["newPassword"] as string, 10) as string
      fields["password"] = hashPassword
    }

    await fetchMutation(api.user.updateUser, { id, updates: fields })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
