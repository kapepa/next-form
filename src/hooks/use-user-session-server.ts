import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function useUserSessionServer() {
  const session = await getServerSession(authOptions);

  return { user: session?.user }
}