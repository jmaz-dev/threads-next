"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
 userId: string;
 username: string;
 name: string;
 bio: string;
 image: string;
 path: string;
}

// User Update
// upsert = update(if exist) and insert(if doesn't exist)
export async function updateUser({ userId, username, name, bio, image, path }: Params): Promise<void> {
 try {
  connectToDB();

  await User.findOneAndUpdate(
   { id: userId },
   { username: username.toLowerCase(), name, bio, image, onboarded: true },
   { upsert: true }
  );
  if (path === "/profile/edit") {
   revalidatePath(path);
  }
 } catch (error: any) {
  throw new Error("Falha ao criar/editar um usuário: " + error?.message);
 }
}

// User fetch
export async function fetchUser(userId: string) {
 try {
  connectToDB();

  return await User.findOne({ id: userId });
  //   .populate({
  //    path: "communities",
  //    model: Community
  //   });
 } catch (error: any) {
  throw new Error(`Failed to fetch user: ${error?.message}`);
 }
}

// Fetch User Posts
export async function fetchUserPosts(userId: string) {
 try {
  connectToDB();

  // Find all thread authored by user
  const threads = await User.findOne({ id: userId }).populate({
   path: "threads",
   model: Thread,
   populate: {
    path: "children",
    model: Thread,
    populate: {
     path: "author",
     model: User,
     select: "name image id",
    },
   },
  });

  return threads;
 } catch (error: any) {
  throw new Error(`Erro ao buscar posts do usuário: ${error.message}`);
 }
}

// Fetch users
export async function fetchUsers({
 userId,
 searchString = "",
 pageNumber = 1,
 pageSize = 20,
 sortBy = "desc",
}: {
 userId: string;
 searchString?: string;
 pageNumber?: number;
 pageSize?: number;
 sortBy?: SortOrder;
}) {
 try {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;
  // getJsPageSizeInKb
  const regex = new RegExp(searchString, "i");

  const query: FilterQuery<typeof User> = {
   id: { $ne: userId },
  };
  // trim() remove espaços em branco
  if (searchString.trim() !== "") {
   query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
  }

  const sortOptions = { createdAt: sortBy };

  const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

  const totalUsersCount = await User.countDocuments(query);

  const users = await usersQuery.exec();

  const isNext = totalUsersCount > skipAmount + users.length;

  return { users, isNext };
 } catch (error: any) {
  throw new Error(`Erro ao buscar posts do usuário: ${error.message}`);
 }
}

// Fetch activity
export async function getActivity(userId: string) {
 try {
  connectToDB();

  // Fetch all threads created by user
  const userThreads = await Thread.find({ author: userId });

  // Collect all the child threads ids (replies) from the 'childrens'
  const childThreadsIds = userThreads.reduce((acc, userThread) => {
   return acc.concat(userThread.children);
  }, []);

  const replies = await Thread.find({
   _id: { $in: childThreadsIds },
   author: { $ne: userId },
  }).populate({
   path: "author",
   model: User,
   select: "name image _id",
  });

  return replies;
 } catch (error: any) {
  throw new Error(`Erro ao encontrar atividades do usuário: ${error.message}`);
 }
}
