import ProfileHeader from "@/app/components/shared/ProfileHeader";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/app/components/shared/ThreadsTab";
import UserCard from "@/app/components/cards/UserCard";
import Link from "next/link";

const Page = async () => {
 const user = await currentUser();

 if (!user) return null;

 const userInfo = await fetchUser(user.id);

 if (!userInfo?.onboarded) redirect("/onboarding");

 // Get Activity
 const activity = await getActivity(userInfo._id);

 // Fetch users
 const result = await fetchUsers({
  userId: user.id,
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
 });
 return (
  <section>
   <h1 className="head-text mb-10">Atividade</h1>

   <section className="mt-10 flex flex-col gap-5">
    {activity.length > 0 ? (
     <>
      {activity.map((act) => (
       <Link key={act.id} href={`/thread/${act.parentId}`}>
        <article className="activity-card">
         <Image
          src={act.author[0].image}
          alt="Foto de perfil"
          width={20}
          height={20}
          className="rounded-full object-cover"
         />
         <p className="!text-small-regular text-light-1">
          <span className="mr-1 text-primary-500">{act.author[0].name}</span> respondeu o seu thread
         </p>
        </article>
       </Link>
      ))}
     </>
    ) : (
     <p className="text-light-3 !text-base-regular">Você não possui notificações.</p>
    )}
   </section>
  </section>
 );
};

export default Page;
