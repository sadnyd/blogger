import { getPostBySlug } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  // Only show published posts publicly
  if (!post || post.status !== 'published') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-white border-b">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Back to Blog
          </Link>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {post.title}
            </h1>
            <time className="text-gray-500 text-sm block">
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </header>
          
          <div className="prose prose-lg prose-blue mx-auto max-w-none text-gray-800">
            {/* Render MDX Content securely on the server */}
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>
    </div>
  )
}
