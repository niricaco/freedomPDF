import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Simple check against env variables
        const validUsername = process.env.ADMIN_USER || "admin";
        const validPassword = process.env.ADMIN_PASSWORD || "password";

        if (
          credentials?.username === validUsername &&
          credentials?.password === validPassword
        ) {
          return { id: "1", name: validUsername, email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
