
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { auth } from '@clerk/nextjs/server';
import { users } from '@clerk/clerk-sdk-node';
import { prisma } from '@/lib/db'; // adjust to your actual path

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount } = await req.json();

  if (!amount || isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Invalid claim amount' }, { status: 400 });
  }

  try {
    const user = await users.getUser(userId);
    const username = user.username || user.firstName || user.emailAddresses[0]?.emailAddress || 'Unknown User';

    // Fetch wallet info from DB
    const wallet = await prisma.userWallet.findUnique({
      where: { userId }, // assumes userId is a unique identifier in your Wallet model
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if amount exceeds balance
    if (amount > wallet.remainingBalance) {
      return NextResponse.json({
        error: `❌ You don't have enough balance. You can only request up to ₹${wallet.remainingBalance}.`,
      }, { status: 400 });
    }

    // Send email if valid
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Wallet Claims" <${process.env.MAIL_USER}>`,
      to: 'sanjay@wigoh.ai',
      subject: '🧾 New Claim Request',
      html: `
        <h2>New Claim Request</h2>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Requested Amount:</strong> ₹${amount}</p>
        <p>Check the admin dashboard to review and approve the request.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to process claim request' }, { status: 500 });
  }
}
