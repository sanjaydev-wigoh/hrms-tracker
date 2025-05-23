import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth';


export async function registerUser({ email, password, userName, }: { email: string; password: string; userName: string;}) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username: userName, 
      },
    });
  
    const token = signJwt(Number(user.id), { userId: user.id });
    return { token };
  }

  export async function loginUser({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = signJwt(Number(user.id), { userId: user.id });
    return { token };
  }