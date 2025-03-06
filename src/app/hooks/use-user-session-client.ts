"use client";

import { useSession } from "next-auth/react";

export function useUserSessionClient() {
  const { data } = useSession();

  return { user: data?.user }
}