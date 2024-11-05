import NextAuth, { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from '@prisma/client';

import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt"
  },
  pages:{
    signIn: '/auth/signIn',
    error: '/auth/error',
    signOut:'/auth/signout'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials, req) {
        const prismaClient = new PrismaClient();
        const user = await prismaClient.user.findUnique({
          where: {
            email: credentials?.email,
          },
          include: {
            accounts: true,
          }
        })
        
        if(!user) return {error: 'user not found'}
        
        if(user) {
          const passwordCorrect = await bcrypt.compare(credentials?.password! || '', user.password!)              
          if ( passwordCorrect) return user
          // else {return {error: 'password incorrect'}}
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

