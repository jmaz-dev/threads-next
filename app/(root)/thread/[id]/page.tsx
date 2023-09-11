import ThreadCard from "@/app/components/cards/ThreadCard";
import Comment from "@/app/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
 if (!params.id) return null;
 const user: any = await currentUser();
 const userInfo = await fetchUser(user.id);
 if (!userInfo.onboarded) redirect("/onboarding");
 const thread = await fetchThreadById(params.id);
 return (
  <section className="relative">
   <div>
    <ThreadCard
     key={thread._id}
     id={thread._id}
     currentUserId={user?.id || ""}
     parentId={thread.parentId}
     content={thread.text}
     author={thread.author[0]}
     community={thread.community}
     createdAt={thread.createdAt}
     comments={thread.children}
    />
   </div>
   <div className="mt-7">
    <Comment threadId={thread.id} currentUserImage={user.imageUrl} currentUserId={JSON.stringify(userInfo._id)} />
   </div>
  </section>
 );
};

export default Page;
