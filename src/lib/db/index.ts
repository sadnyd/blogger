import { createClient } from '../supabase/server';
import { logger } from '@/lib/logger';

export async function getPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching posts:', error);
    return [];
  }

  return posts;
}

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching published posts:', error);
    return [];
  }

  return posts;
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    logger.error(`Error fetching post ${slug}:`, error);
    return null;
  }

  return post;
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    logger.error(`Error fetching post ${id}:`, error);
    return null;
  }

  return post;
}
