import { redirect, unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createPost, getPost } from '@/lib/posts'

export async function save(data: FormData) {
  'use server'
  try {
    await createPost(data)
  } catch (error) {
    return { message: 'Could not save the post' }
  }
  revalidatePath('/posts')
  redirect('/posts')
}

export async function load(id: string) {
  try {
    const post = await getPost(id)
    if (!post) redirect('/posts')
    return post
  } catch (error) {
    unstable_rethrow(error)
    return null
  }
}

export async function track(id: string) {
  try {
    if (!id) redirect('/')
  } finally {
    console.info('tracked')
  }
}
