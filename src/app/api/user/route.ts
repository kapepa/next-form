import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existUser = await fetchQuery(api.user.getUserByEmail, { email });
    if (!!existUser) throw "The user already exists such a letter";

    const hashPassword = await bcrypt.hash(password, 10)

    // Call the Convex mutation to create a user
    const createUser = fetchMutation(api.user.createUser, { name, email, password: hashPassword });

    return NextResponse.json(
      { success: true, createUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}