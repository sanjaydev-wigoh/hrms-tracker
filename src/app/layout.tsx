import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Header from "./components/header/page";
// import {loadClerkSecrets} from "@/lib/SecretManager";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "My App",
  description: "Next.js app with Clerk + PostgreSQL + Prisma",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // await loadClerkSecrets(); 

    return (
    <ClerkProvider>
      <html lang="en">
        
        <body className={inter.className}><Header/>{children} <ToastContainer position="top-right" autoClose={3000} /></body>
      </html>
    </ClerkProvider>
  );
}

