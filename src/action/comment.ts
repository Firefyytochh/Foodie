"use server";

import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const addComment = async (formData: FormData) => {
  const comment = formData.get("comment") as string;

  if (!comment || comment.trim() === "") {
    return { error: { message: "Comment cannot be empty." } };
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: { message: "You must be logged in to comment." } };
  }

  const user = userData.user;

  const { data, error } = await supabase
    .from("comments")
    .insert([{ content: comment, user_id: user.id }]);

  if (error) {
    console.error("Error adding comment:", error);
    return { error };
  }
  revalidatePath("/landingpage");
};

export const getComments = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return { error };
  }

  return { data };
};
