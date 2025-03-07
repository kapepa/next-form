import { authOptions } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import { getServerSession } from "next-auth";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { Routers } from "@/types/routers";

export async function useProfileMyselfServer() {
  const session = await getServerSession(authOptions);
  const profile = !!session?.user ? await fetchQuery(api.user.getUserById, { id: session?.user.id }) : null;

  if (!profile) redirect(Routers.login);

  return { profile }
}