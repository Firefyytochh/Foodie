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
    
    // Get total count first
    const { count, error: countError } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return { data: [], error: countError.message, hasMore: false, total: 0 };
    }

    // Get comments only (no joins)
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Comments fetch error:', error);
      return { data: [], error: error.message, hasMore: false, total: 0 };
    }

    // Enrich with user data manually
    const enrichedData = await Promise.all(
      (data || []).map(async (comment) => {
        try {
          // Get user data from auth.users
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(comment.user_id);
          
          // Get profile data
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .single();

          const username = profile?.username || 
                          userData?.user?.user_metadata?.full_name || 
                          userData?.user?.email?.split('@')[0] || 
                          'Anonymous User';

          const avatar_url = profile?.avatar_url || 
                            userData?.user?.user_metadata?.avatar_url || 
                            null;

          return {
            ...comment,
            profiles: {
              username,
              avatar_url
            }
          };
        } catch (enrichError) {
          console.error('Error enriching comment:', enrichError);
          return {
            ...comment,
            profiles: {
              username: 'Anonymous User',
              avatar_url: null
            }
          };
        }
      })
    );

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
        comment_text: commentText.trim(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }

    // Get user data for the response
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      const enrichedComment = {
        ...data,
        profiles: {
          username: profileData?.username || 
                   userData?.user?.user_metadata?.full_name || 
                   userData?.user?.email?.split('@')[0] || 
                   'Anonymous User',
          avatar_url: profileData?.avatar_url || 
                     userData?.user?.user_metadata?.avatar_url || 
                     null
        }
      };

      return { data: enrichedComment, error: null };
    } catch (enrichError) {
      // Return comment without enriched data if enrichment fails
      return { 
        data: {
          ...data,
          profiles: {
            username: 'Anonymous User',
            avatar_url: null
          }
        }, 
        error: null 
      };
    }
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
    
    // First check if comment exists and belongs to user
    const { data: existingComment, error: checkError } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (checkError || !existingComment) {
      return { data: null, error: 'Comment not found' };
    }

    if (existingComment.user_id !== userId) {
      return { data: null, error: 'You can only edit your own comments' };
    }

    // Update the comment
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ 
        comment_text: newText.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
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
    
    // First check if comment exists and belongs to user
    const { data: existingComment, error: checkError } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (checkError || !existingComment) {
      return { error: 'Comment not found' };
    }

    if (existingComment.user_id !== userId) {
      return { error: 'You can only delete your own comments' };
    }

    // Delete the comment
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

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