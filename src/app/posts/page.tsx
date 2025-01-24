import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/post-card'

async function getPosts() {
  return prisma.log.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  })
}

export default async function PostsPage() {
  // const [session, posts] = await Promise.all([
  //   getServerSession(authOptions),
  //   getPosts()
  // ])
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <div key={post.id} className="h-[250px]">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}