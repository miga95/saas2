import { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

declare module "next-auth" {
  interface User {
    id: string;
  }
  interface Session {
    user: User & {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
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
  events: {
    createUser: async (message) => {
      const userId = message.user.id;
      const email = message.user.email;
      const name = message.user.name;

      if(!userId || !email) return;

      const stripeCustomer = await stripe.customers.create({
        email: email ?? undefined,
        name: name ?? undefined
      })

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          stripeCustomerId: stripeCustomer.id
        }
      })
    }
  },
  pages:{
    signIn: '/auth/signin',
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
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            image: true
          }
        })
        
        if (!user) return null;
        
        const passwordCorrect = await bcrypt.compare(credentials?.password! || '', user.password!)              
        if (passwordCorrect) {
          const { password, ...userWithoutPass } = user;
          return userWithoutPass;
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