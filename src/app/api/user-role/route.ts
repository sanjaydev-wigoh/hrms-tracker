import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import clerkClient from "@clerk/clerk-sdk-node";
import { prisma } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user details from Clerk using userId
    const clerkUser = await clerkClient.users.getUser(userId);
    const username = clerkUser.username;

    if (!username) {
      return NextResponse.json({ error: "Username not found in Clerk" }, { status: 400 });
    }

    // Look up user role in your Prisma database
    const user = await prisma.user.findMany({
      where: { username },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ role: user[0]?.role || null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
