// src/components/posts/post-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Log, User } from '@prisma/client'

type PostWithUser = Log & {
  user: {
    name: string | null
    image: string | null
  }
}

interface PostCardProps {
  post: PostWithUser
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link 
      href={`/posts/${post.id}`}
      className="block h-full"
    >
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="font-medium text-gray-800">
              K
            </div>
            <time className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true,
                locale: ja 
              })}
            </time>
          </div>

          <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
            {post.title}
          </h2>
          
          <p className="text-gray-600 line-clamp-3">
            {post.content.replace(/[#*`]/g, '')}
          </p>
        </div>

        <div className="mt-4 text-sm text-blue-600 hover:text-blue-700">
          続きを読む →
        </div>
      </article>
    </Link>
  )
}