"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";

import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/threads";
import { createThread } from "@/lib/actions/thread.actions";

// import { updateUser } from "@/lib/actions/user.actions";
// import UserValidation from "@/lib/validations/user";

const PostThread = ({ userId }: { userId: string }) => {
 const { organization } = useOrganization();
 const pathname = usePathname();
 const route = useRouter();
 const form = useForm({
  resolver: zodResolver(ThreadValidation),
  defaultValues: {
   thread: "",
   accountId: userId,
   path: pathname,
  },
 });
 const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
  await createThread({
   text: values.thread,
   author: userId,
   communityId: organization ? organization.id : null,
   path: pathname,
  });

  route.push("/");
 };

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mt-10 justify-start gap-10">
    <FormField
     control={form.control}
     name="thread"
     render={({ field }) => (
      <FormItem className="flex flex-col gap-3 w-full">
       <FormLabel className="text-base-semibold text-light-2">Conteúdo</FormLabel>
       <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
        <Textarea rows={15} {...field} placeholder="Iniciar uma thread..." />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />

    <Button type="submit" className="bg-primary-500">
     Publicar
    </Button>
   </form>
  </Form>
 );
};

export default PostThread;
