"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Add the missing getSupabaseAdmin function
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Your existing functions (keep these as they are)
export async function updateComment(commentId: string, newText: string, userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Verify the comment belongs to the user
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !comment) {
      return { error: 'Comment not found' };
    }

    if (comment.user_id !== userId) {
      return { error: 'You can only edit your own comments' };
    }

    // Update the comment
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ 
        comment_text: newText.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Verify the comment belongs to the user
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !comment) {
      return { error: 'Comment not found' };
    }

    if (comment.user_id !== userId) {
      return { error: 'You can only delete your own comments' };
    }

    // Delete the comment
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Replace your getComments function with this:
export async function getComments(limit: number = 10, offset: number = 0) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get total count first
    const { count, error: countError } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return { data: [], error: countError.message, hasMore: false, total: 0 };
    }

    // Get comments with pagination
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Comments fetch error:', error);
      return { data: [], error: error.message, hasMore: false, total: 0 };
    }

    const totalComments = count || 0;
    const hasMore = (offset + limit) < totalComments;

    return { 
      data: data || [], 
      error: null, 
      hasMore, 
      total: totalComments 
    };
  } catch (error: any) {
    console.error('Get comments error:', error);
    return { data: [], error: error.message, hasMore: false, total: 0 };
  }
}

export async function addComment(commentText: string, userId: string) {
  try {
    if (!commentText.trim()) {
      return { data: null, error: 'Comment text is required' };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert([{
        user_id: userId,
        comment_text: commentText.trim(),
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Add comment failed:', error);
    return { data: null, error: error.message };
  }
}