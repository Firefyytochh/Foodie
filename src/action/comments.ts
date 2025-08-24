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

    // Get comments with flexible column selection
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Comments fetch error:', error);
      return { data: [], error: error.message, hasMore: false, total: 0 };
    }

    // Handle both column names (comment_text or content)
    const enrichedData = (data || []).map(comment => ({
      ...comment,
      comment_text: comment.comment_text || comment.content || '',
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
    
    // Simple approach - try comment_text first, then content
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert([{
        user_id: userId,
        comment_text: commentText.trim()
      }])
      .select('*')
      .single();

    if (error) {
      // If comment_text failed, try content column
      if (error.message.includes('comment_text') || error.code === '42703') {
        const { data: data2, error: error2 } = await supabaseAdmin
          .from('comments')
          .insert([{
            user_id: userId,
            content: commentText.trim()
          }])
          .select('*')
          .single();

        if (error2) {
          console.error('Both comment_text and content failed:', error2);
          return { data: null, error: error2.message };
        }

        // Return with mapped content to comment_text
        const enrichedComment = {
          ...data2,
          comment_text: data2.content || '',
          profiles: { username: 'User', avatar_url: null }
        };
        return { data: enrichedComment, error: null };
      }
      
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }

    // Success with comment_text
    const enrichedComment = {
      ...data,
      comment_text: data.comment_text || '',
      profiles: { username: 'User', avatar_url: null }
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
    
    // Try updating comment_text first
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ 
        comment_text: newText.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      // If comment_text failed, try content column
      if (error.message.includes('comment_text') || error.code === '42703') {
        const { data: data2, error: error2 } = await supabaseAdmin
          .from('comments')
          .update({ 
            content: newText.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', commentId)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (error2) {
          console.error('Update with content failed:', error2);
          return { data: null, error: error2.message };
        }

        return { 
          data: {
            ...data2,
            comment_text: data2.content || ''
          }, 
          error: null 
        };
      }
      
      console.error('Update comment error:', error);
      return { data: null, error: error.message };
    }

    return { 
      data: {
        ...data,
        comment_text: data.comment_text || ''
      }, 
      error: null 
    };
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
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}