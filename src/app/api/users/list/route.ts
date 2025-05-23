// This API should return a list of all usernames
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { username: true },
    });
    const usernames = users.map((u) => u.username);
    return NextResponse.json({ usernames });
  } catch (error) {
    console.error('Error fetching users:', error); 
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
