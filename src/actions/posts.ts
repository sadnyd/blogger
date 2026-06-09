'use server'

import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().optional(),
  status: z.enum(['draft', 'published'])
})

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const parsed = postSchema.safeParse({
    title,
    slug,
    content,
    status,
  })
  if (!parsed.success) {
    logger.error('Invalid post data:', parsed.error)
    throw new Error('Invalid post data')
  }
  const { title: vTitle, slug: vSlug, content: vContent, status: vStatus } = parsed.data

  const { error } = await supabase.from('posts').insert({
    title: vTitle,
    slug: vSlug,
    content: vContent,
    status: vStatus,
    author_id: user.id
  })

  if (error) {
    logger.error('Failed to create post:', error)
    throw new Error('Failed to create post')
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const parsed = postSchema.safeParse({
    title,
    slug,
    content,
    status,
  })
  if (!parsed.success) {
    logger.error('Invalid post data:', parsed.error)
    throw new Error('Invalid post data')
  }
  const { title: vTitle, slug: vSlug, content: vContent, status: vStatus } = parsed.data

  const { error } = await supabase.from('posts')
    .update({ title: vTitle, slug: vSlug, content: vContent, status: vStatus })
    .eq('id', id)
    .eq('author_id', user.id) // Extra safety check

  if (error) {
    logger.error('Failed to update post:', error)
    throw new Error('Failed to update post')
  }

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/post/${slug}`)
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('posts')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    logger.error('Failed to delete post:', error)
    throw new Error('Failed to delete post')
  }

  revalidatePath('/admin')
  revalidatePath('/')
}
