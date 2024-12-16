import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscription: user.subscription ? {
        status: user.subscription.status,
        stripeCurrentPeriodEnd: user.subscription.stripeCurrentPeriodEnd,
      } : null,
    });
  } catch (error) {
    console.error("[USER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 