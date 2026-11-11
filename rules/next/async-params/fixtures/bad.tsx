import { getPost } from '@/lib/posts'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return { title: post.title }
}

export default function Page(props: { params: { slug: string }; searchParams: { tab?: string } }) {
  const { tab } = props.searchParams
  return <Post slug={props.params.slug} tab={tab} />
}
