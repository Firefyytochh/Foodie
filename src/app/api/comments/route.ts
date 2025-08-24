import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = getSupabaseAdmin();
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json({ comments: [], hasMore: false, total: 0 });
    }

    // Get comments with profiles
    const { data, error } = await supabase
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
      console.error('Comments error:', error);
      return NextResponse.json({ comments: [], hasMore: false, total: 0 });
    }

    const hasMore = (offset + limit) < (count || 0);

    return NextResponse.json({ 
      comments: data || [], 
      hasMore, 
      total: count || 0 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      comments: [], 
      hasMore: false, 
      total: 0 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, user_id } = body;

    if (!content || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: content.trim(), user_id }])
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}