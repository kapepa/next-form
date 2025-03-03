import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { registrationSchema } from "./schemas/registration-schema";
import { ZodError, z } from "zod";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

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
        name: { label: "name", type: "text" },
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: Record<"name" | "email" | "password", string> | undefined) {
        try {
          let user = null
          const { name, email, password } = await registrationSchema.parseAsync(credentials);

          const existUser = await fetchQuery(api.user.getUserByEmail, { email });

          console.log(existUser)

          // // logic to salt and hash password
          // const pwHash = saltAndHashPassword(password)

          // // logic to verify if the user exists
          // user = await getUserFromDb(email, pwHash)

          // if (!user) throw new Error("Invalid credentials.")

          return user
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
  // Customize pages (optional)
  pages: {
    signIn: "/registration", // Custom sign-in page
  },
  // Callbacks for customizing JWT and session behavior
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // session.user.id = token.id;
      return session;
    },
  },
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};