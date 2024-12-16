import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import { NextResponse } from "next/server";

export async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        error: "Unauthorized",
        message: "You must be logged in to access this resource",
      }),
      { status: 401 }
    );
  }

  return session;
} 