"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
 text: string;
 author: string;
 communityId: string | null;
 path: string;
}
// criar
export async function createThread({ text, author, communityId, path }: Params): Promise<void> {
 try {
  connectToDB();

  const createdThread = await Thread.create({
   text,
   author,
   community: null,
  });

  // Update user model
  await User.findByIdAndUpdate(author, {
   $push: { threads: createdThread._id },
  });
  revalidatePath(path);
 } catch (error: any) {
  throw new Error("Falha ao criar uma thread: " + error?.message);
 }
}
// carregar posts
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
 try {
  connectToDB();

  //Posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents(top-level threads..)
  const postsQuery = Thread.find({
   parentId: {
    $in: [null, undefined],
   },
  })
   .sort({ createdAt: "desc" })
   .skip(skipAmount)
   .limit(pageSize)
   .populate({ path: "author", model: User })
   .populate({
    path: "children",
    populate: {
     path: "author",
     model: User,
     select: "_id name parentId image",
    },
   });

  const totalPostsCount = await Thread.countDocuments({
   parentId: {
    $in: [null, undefined],
   },
  });
  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
 } catch (err) {
  console.error(err);
 }
}
// busca por id
export async function fetchThreadById(id: string) {
 connectToDB();

 try {
  const thread = await Thread.findById(id)
   .populate({
    path: "author",
    model: User,
    select: "_id id name image",
   })
   .populate({
    path: "children",
    populate: [
     {
      path: "author",
      model: User,
      select: "_id id parentId image",
     },
     {
      path: "children",
      model: Thread,
      populate: {
       path: "author",
       model: User,
       select: "_id id name parentId image",
      },
     },
    ],
   })
   .exec();

  return thread;
 } catch (error: any) {
  throw new Error(`Error ao buscar thread: ${error.message}`);
 }
}

// postar comentario
export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
 connectToDB();

 try {
  const originalThread = await Thread.findById(threadId);
  if (!originalThread) throw new Error("Thread não encontrado");

  const commentThread = new Thread({
   text: commentText,
   author: userId,
   parentId: threadId,
  });

  // save the new thread
  const saveCommentThread = await commentThread.save();

  // update original thread to include the comment
  originalThread.children.push(saveCommentThread._id);

  // save original thread
  await originalThread.save();

  revalidatePath(path);
 } catch (error: any) {
  throw new Error(`Error ao adicionar comentário: ${error.message}`);
 }
}
