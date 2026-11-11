import { redirect, notFound as missing } from 'next/navigation'
import { createPost, getPost } from '@/lib/posts'

export async function save(data: FormData) {
  'use server'
  try {
    await createPost(data)
    redirect('/posts')
  } catch (error) {
    return { message: 'Could not save the post' }
  }
}

export default async function Page({ params }: PageProps<'/posts/[id]'>) {
  try {
    const post = await getPost((await params).id)
    if (!post) missing()
    return <article>{post.title}</article>
  } catch {
    return <p>Something went wrong.</p>
  }
}
