"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignOutButton, OrganizationSwitcher, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
function LeftSidebar() {
 const route = useRouter();
 const pathname = usePathname();
 const { userId } = useAuth();

 return (
  <section className="custom-scrollbar leftsidebar">
   <div className="flex w-full flex-1 flex-col gap-6 px-6">
    {sidebarLinks.map((link) => {
     const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
     if (link.route === "/profile") link.route = `${link.route}/${userId}`;
     return (
      <Link href={link.route} key={link.label} className={`${isActive && "bg-primary-500"} leftsidebar_link`}>
       <Image src={link.imgURL} alt={link.label} width={24} height={24} />
       <p className="text-light-1  max-lg:hidden">{link.label}</p>
      </Link>
     );
    })}
   </div>
   <div className="mt-10 px-6">
    <SignOutButton signOutCallback={() => route.push("/sign-in")}>
     <div className="flex cursor-pointer gap-4 p-4">
      <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
      <p className="text-light-2 max-lg:hidden">Sair</p>
     </div>
    </SignOutButton>
   </div>
  </section>
 );
}
export default LeftSidebar;
