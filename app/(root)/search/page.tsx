import ProfileHeader from "@/app/components/shared/ProfileHeader";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/app/components/shared/ThreadsTab";
import UserCard from "@/app/components/cards/UserCard";

const Page = async () => {
 const user = await currentUser();
 if (!user) return null;

 const userInfo = await fetchUser(user.id);
 if (!userInfo?.onboarded) redirect("/onboarding");

 // Fetch users
 const result = await fetchUsers({
  userId: user.id,
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
 });
 return (
  <section>
   <h1 className="head-text mb-10">Buscar</h1>

   <div className="mt-14 flex flex-col gap-9">
    {result.users.length === 0 ? (
     <p className="no-result">Não encontramos nenhum resultado</p>
    ) : (
     <>
      {result.users.map((person) => (
       <UserCard
        key={person.id}
        id={person.id}
        name={person.name}
        username={person.username}
        imgUrl={person.image}
        personType="User"
       />
      ))}
     </>
    )}
   </div>
  </section>
 );
};

export default Page;
