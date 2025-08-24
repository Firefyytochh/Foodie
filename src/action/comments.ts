"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getComments(limit: number = 10, offset: number = 0) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return { data: [], error: countError.message, hasMore: false, total: 0 };
    }

    // Get comments
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select(`
        id,
        user_id,
        comment_text,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Comments fetch error:', error);
      return { data: [], error: error.message, hasMore: false, total: 0 };
    }

    // Add simple user data
    const enrichedData = (data || []).map(comment => ({
      ...comment,
      profiles: {
        username: 'User',
        avatar_url: null
      }
    }));

    const totalComments = count || 0;
    const hasMore = (offset + limit) < totalComments;

    return { 
      data: enrichedData, 
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
        comment_text: commentText.trim()
      }])
      .select(`
        id,
        user_id,
        comment_text,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }

    // Return with simple profile data
    const enrichedComment = {
      ...data,
      profiles: {
        username: 'User',
        avatar_url: null
      }
    };

    return { data: enrichedComment, error: null };
  } catch (error: any) {
    console.error('Add comment failed:', error);
    return { data: null, error: error.message };
  }
}

export async function updateComment(commentId: string, newText: string, userId: string) {
  try {
    if (!newText.trim()) {
      return { data: null, error: 'Comment text is required' };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ 
        comment_text: newText.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', userId)
      .select(`
        id,
        user_id,
        comment_text,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error('Update comment error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Update comment failed:', error);
    return { data: null, error: error.message };
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete comment error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete comment failed:', error);
    return { error: error.message };
  }
}