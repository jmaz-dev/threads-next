import "../globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import Topbar from "../components/shared/Topbar";
import LeftSidebar from "../components/shared/LeftSidebar";
import RightSidebar from "../components/shared/RightSidebar";
import Bottombar from "../components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
 title: "Threads Next",
 description: "A Next.js 13 Meta Threads Application",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <ClerkProvider localization={ptBR}>
   <html lang="en">
    <body className={inter.className}>
     <Topbar />
     <main className="flex flex-row">
      <LeftSidebar />
      <section className="main-container">
       <div className="w-full max-w-4xl">{children}</div>
      </section>
      <RightSidebar />
     </main>
     <Bottombar />
    </body>
   </html>
  </ClerkProvider>
 );
}
