import PostEditor from '@/components/PostEditor'
import { getPostById } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const post = await getPostById(resolvedParams.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <PostEditor post={post} />
    </div>
  )
}
