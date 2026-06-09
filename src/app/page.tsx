import { getPublishedPosts } from '@/lib/db'
import Link from 'next/link'

export default async function Home() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Blog</h1>
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Admin Login
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {posts?.map((post) => (
            <article key={post.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/post/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-500 mb-4">
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <p className="text-gray-700 line-clamp-3">
                {/* A naive summary extraction: strip markdown or just show first 150 chars */}
                {post.content.slice(0, 150)}...
              </p>
              <div className="mt-4">
                <Link href={`/post/${post.slug}`} className="text-blue-600 font-semibold hover:text-blue-800">
                  Read more &rarr;
                </Link>
              </div>
            </article>
          ))}
          {(!posts || posts.length === 0) && (
            <div className="text-center text-gray-500">
              No posts have been published yet.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
