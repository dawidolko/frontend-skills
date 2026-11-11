import { use } from 'react'
import { getPost } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  return [{ id: params.slug }]
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post.title }
}

export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  const tab = (await props.searchParams).tab
  return <Post slug={slug} tab={tab ?? query.tab} />
}

function Tabs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  return <nav data-slug={slug}>{searchParams.get('tab')}</nav>
}
