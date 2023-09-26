import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Inter } from "next/font/google";
import "../globals.css";
import React from "react";

export const metadata = {
 title: "Welcome - Threads Next",
 description: "A Next.js 13 Meta Threads Application",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <ClerkProvider localization={ptBR}>
   <html lang="en">
    <body className={`${inter.className} bg-dark-1`}>
     <div className="flex justify-center items-center min-h-screen">{children}</div>
    </body>
   </html>
  </ClerkProvider>
 );
}
