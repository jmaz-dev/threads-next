"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/threads";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
 threadId: string;
 currentUserId: string;
 currentUserImage: string;
}

const Comment = ({ threadId, currentUserId, currentUserImage }: Props) => {
 const pathname = usePathname();
 const route = useRouter();
 const form = useForm({
  resolver: zodResolver(CommentValidation),
  defaultValues: {
   thread: "",
  },
 });

 const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
  await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

  form.reset();
 };

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
    <FormField
     control={form.control}
     name="thread"
     render={({ field }) => (
      <FormItem className="flex gap-3 items-center w-full">
       <FormLabel>
        <Image
         src={currentUserImage}
         alt="Imagem perfil"
         width={48}
         height={48}
         className="rounded-full object-cover"
        />
       </FormLabel>
       <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
        <Input
         type="text"
         placeholder="Iniciar um comentário..."
         className="no-focus text-light-1 outline-none"
         {...field}
        />
       </FormControl>
      </FormItem>
     )}
    />

    <Button type="submit" className="comment-form_btn">
     Responder
    </Button>
   </form>
  </Form>
 );
};

export default Comment;
