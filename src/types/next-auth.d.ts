import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name?: string;
    email?: string;
  }

  interface Session {
    user: User;
  }
}