import UserSuggest from "@/app/(root)/search/page";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "../cards/UserCard";
async function RightSidebar() {
 const user = await currentUser();
 if (!user) return null;

 const userInfo = await fetchUser(user.id);
 if (!userInfo?.onboarded) redirect("/onboarding");

 // Fetch users
 const userFetched = await fetchUsers({
  userId: user.id,
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
 });

 const commFetched = await fetchCommunities({
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
 });
 return (
  <section className="custom-scrollbar rightsidebar">
   <div className="flex flex-1 flex-col justify-start">
    <h3 className="text-heading4-medium text-light-1">Comunidades Sugeridas</h3>
    {/* users div */}
    <section>
     <div className="mt-6 flex flex-col gap-9">
      {commFetched.communities.length === 0 ? (
       <p className="no-result">Não encontramos nenhum resultado</p>
      ) : (
       <>
        {commFetched.communities.map((community) => (
         <UserCard
          key={community.id}
          id={community.id}
          name={community.name}
          username={community.username}
          imgUrl={community.image}
          personType="Community"
         />
        ))}
       </>
      )}
     </div>
    </section>
   </div>
   <div className="flex flex-1 flex-col justify-start">
    <h3 className="text-heading4-medium text-light-1">Usuários Sugeridos</h3>
    {/* users div */}
    <section>
     <div className="mt-6 flex flex-col gap-9">
      {userFetched.users.length === 0 ? (
       <p className="no-result">Não encontramos nenhum resultado</p>
      ) : (
       <>
        {userFetched.users.map((person) => (
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
   </div>
  </section>
 );
}
export default RightSidebar;
