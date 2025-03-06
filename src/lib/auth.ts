import { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError, z } from "zod";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Routers } from "@/types/routers";
import { loginSchema } from "./schemas/login-schema";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // Add more providers here
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: z.infer<typeof loginSchema> | undefined) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          // Check if a user with the same email already exists
          const existUser = await fetchQuery(api.user.getUserByEmail, { email });
          if (!existUser) throw "User does not exist";

          const compare = await bcrypt.compare(password, existUser.password);
          if (!compare) throw "Password is not correct"

          // Return the user object
          return {
            id: existUser._id,
            name: existUser.name,
            email: existUser.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
          } else {
            console.error("Authorization error:", error);
          }
          return null; // Return null to indicate invalid credentials
        }
      },
    }),
  ],
  pages: {
    signIn: Routers.login,
    error: Routers.AuthError, // Custom error page
  },
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  // Callbacks for customizing JWT and session behavior
  callbacks: {
    async jwt({ token }: { token: JWT }) {
      if (!token.email) return token;

      const existUser = await fetchQuery(api.user.getUserByEmail, { email: token.email });
      if (!existUser) return token;

      token.id = existUser._id;
      token.name = existUser.name;

      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};