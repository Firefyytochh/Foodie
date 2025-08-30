"use server";

import { createClient } from "@supabase/supabase-js";
import { UUID } from "crypto";

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}


export async function deleteComment(commentId: UUID, userId?: UUID | string | null) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Normalize userId: only keep real UUIDs, otherwise force to null
    if (!userId || userId === "null" || userId === "undefined") {
      userId = null;
    }

    if (!commentId) {
      throw new Error("Invalid commentId");
    }

    console.log("deleteComment called with:", { commentId, userId });

    let query = supabaseAdmin.from("comments").delete().eq("id", commentId);

    // Only filter by user_id if it's a real UUID
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { error } = await query;

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error("Failed to delete comment");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      error: {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}


export async function addComment(comment: string, userId: string) {
  try {
    if (!comment || comment.trim() === '') {
      return { error: { message: 'Comment cannot be empty' } };
    }

    if (!userId) {
      return { error: { message: 'You must be logged in to comment' } };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert([
        {
          content: comment.trim(),
          user_id: userId,
        }
      ])
      .select();

    if (error) {
      return { error };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
        return { error: { message: error.message } };
    }
    return { error: { message: 'An unknown error occurred' } };
  }
}

export async function getComments(limit: number = 10, offset: number = 0) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    console.log('🔍 Fetching comments...');
    
    // Step 1: Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return { data: [], error: null, hasMore: false, total: 0 };
    }

    // Step 2: Get comments with pagination
    const { data: commentsData, error: commentsError } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (commentsError) {
      console.error('Comments error:', commentsError);
      return { data: [], error: null, hasMore: false, total: 0 };
    }

    // Step 3: Get user profiles for each comment
    const commentsWithProfiles = [];
    for (const comment of commentsData || []) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', comment.user_id)
          .single();

        commentsWithProfiles.push({
          ...comment,
          profiles: profile || { username: 'Anonymous User', avatar_url: null }
        });
      } catch (profileError) {
        console.error("Failed to fetch profile for a comment:", profileError);
        // If profile fetch fails, use anonymous
        commentsWithProfiles.push({
          ...comment,
          profiles: { username: 'Anonymous User', avatar_url: null }
        });
      }
    }

    const hasMore = (offset + limit) < (count || 0);

    console.log('🔍 Successfully fetched comments:', commentsWithProfiles.length);

    return { 
      data: commentsWithProfiles, 
      error: null, 
      hasMore, 
      total: count || 0 
    };
    
  } catch (error) {
    console.error('🔍 Catch error:', error);
    return { 
      data: [], 
      error: null, 
      hasMore: false,
      total: 0 
    };
  }
}

