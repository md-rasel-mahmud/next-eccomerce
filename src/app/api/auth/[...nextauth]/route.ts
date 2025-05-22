// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { Roles } from "@/enums/Roles.enum";
import { IUser, User } from "@/lib/models/user.model";

// Extend the default session user type to include _id and role
declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials.password) {
          throw new Error("Phone and password required");
        }

        await connectDB();

        const user = await User.findOne({ phone: credentials.phone });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        const typedUser = user as IUser;

        return {
          id: (typedUser._id as { toString: () => string }).toString(),
          name: typedUser.name,
          phone: typedUser.phone,
          role: typedUser.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.role = (user as IUser).role;
        token.phone = (user as IUser).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.role = token.role as Roles;
        session.user.phone = token.phone as string;
      }
      console.log("session", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
