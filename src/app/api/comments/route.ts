import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)') // Assuming you have a 'profiles' table linked to auth.users
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { comment_text } = await request.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ user_id: user.id, comment_text });

  if (error) {
    console.error('Error inserting comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Comment added successfully' }, { status: 201 });
}