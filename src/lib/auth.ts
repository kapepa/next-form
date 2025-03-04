import { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { registrationSchema } from "./schemas/registration-schema";
import { ZodError, z } from "zod";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Routers } from "@/types/routers";

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
      async authorize(credentials: Omit<z.infer<typeof registrationSchema>, "confirmPassword"> | undefined) {
        try {
          const { name, email, password } = await registrationSchema.parseAsync(credentials);

          // Check if a user with the same email already exists
          const existUser = await fetchQuery(api.user.getUserByEmail, { email });
          if (existUser) return null;

          // Hash the password
          const bcryptHash = await bcrypt.hash(password, 10);

          // Create a new user
          const { _creationTime, ...newUser } = await fetchMutation(api.user.createUser, { name, email, password: bcryptHash });

          // Return the user object
          return {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
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
    signIn: Routers.login, // Custom sign-in page
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
      if (!session.user) return session;
      session.user.id = token._id as string;

      return session
    },
  },
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};