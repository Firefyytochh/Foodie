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
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Comments fetch error:', error);
      return { data: [], error: error.message, hasMore: false, total: 0 };
    }

    // Get real user data for each comment
    const enrichedData = await Promise.all(
      (data || []).map(async (comment) => {
        try {
          // Get user data from auth.users
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(comment.user_id);
          
          // Get profile data from profiles table
          const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .single();

          // Extract real user information
          const userEmail = userData?.user?.email || '';
          const userMetadata = userData?.user?.user_metadata || {};
          
          const username = profile?.username || 
                          userMetadata?.full_name || 
                          userMetadata?.name ||
                          userEmail.split('@')[0] || 
                          'Anonymous User';

          // Fix avatar_url handling - construct proper Supabase storage URL
          let avatar_url = null;
          if (profile?.avatar_url) {
            // If avatar_url is just a file path, construct full Supabase URL
            if (!profile.avatar_url.startsWith('http')) {
              avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}`;
            } else {
              avatar_url = profile.avatar_url;
            }
          } else if (userMetadata?.avatar_url || userMetadata?.picture) {
            avatar_url = userMetadata.avatar_url || userMetadata.picture;
          }

          return {
            ...comment,
            comment_text: comment.comment_text || comment.content || '',
            profiles: {
              username,
              avatar_url
            }
          };
        } catch (enrichError) {
          console.error('Error getting user data for comment:', comment.id, enrichError);
          // Fallback to basic info
          return {
            ...comment,
            comment_text: comment.comment_text || comment.content || '',
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
    
    // Try comment_text first, then content
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

        // Get real user data for the new comment
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', userId)
            .single();

          const userEmail = userData?.user?.email || '';
          const userMetadata = userData?.user?.user_metadata || {};
          
          const username = profile?.username || 
                          userMetadata?.full_name || 
                          userMetadata?.name ||
                          userEmail.split('@')[0] || 
                          'Anonymous User';

          const avatar_url = profile?.avatar_url || 
                            userMetadata?.avatar_url || 
                            userMetadata?.picture ||
                            null;

          const enrichedComment = {
            ...data2,
            comment_text: data2.content || '',
            profiles: { username, avatar_url }
          };
          return { data: enrichedComment, error: null };
        } catch (enrichError) {
          const enrichedComment = {
            ...data2,
            comment_text: data2.content || '',
            profiles: { username: 'Anonymous User', avatar_url: null }
          };
          return { data: enrichedComment, error: null };
        }
      }
      
      console.error('Add comment error:', error);
      return { data: null, error: error.message };
    }

    // Success with comment_text - get real user data
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      const userEmail = userData?.user?.email || '';
      const userMetadata = userData?.user?.user_metadata || {};
      
      const username = profile?.username || 
                      userMetadata?.full_name || 
                      userMetadata?.name ||
                      userEmail.split('@')[0] || 
                      'Anonymous User';

      const avatar_url = profile?.avatar_url || 
                        userMetadata?.avatar_url || 
                        userMetadata?.picture ||
                        null;

      const enrichedComment = {
        ...data,
        comment_text: data.comment_text || '',
        profiles: { username, avatar_url }
      };
      return { data: enrichedComment, error: null };
    } catch (enrichError) {
      const enrichedComment = {
        ...data,
        comment_text: data.comment_text || '',
        profiles: { username: 'Anonymous User', avatar_url: null }
      };
      return { data: enrichedComment, error: null };
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