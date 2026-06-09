'use client'

import { createPost, updatePost } from '@/actions/posts'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Post = {
  id?: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
}

export default function PostEditor({ post }: { post?: Post }) {
  const isEditing = !!post?.id
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isEditing) {
        await updatePost(post.id!, formData)
      } else {
        await createPost(formData)
      }
      router.push('/admin')
    } catch (error) {
      console.error(error)
      alert('An error occurred while saving the post.')
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'New Post'}</h1>
        <div className="flex space-x-4">
          <select
            name="status"
            defaultValue={post?.status || 'draft'}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={post?.title}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            defaultValue={post?.slug}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title="Only lowercase letters, numbers, and hyphens"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content (Markdown / MDX)
        </label>
        <textarea
          name="content"
          id="content"
          rows={20}
          defaultValue={post?.content}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </form>
  )
}
