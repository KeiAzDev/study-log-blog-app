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
      className="block group"
    >
      <article className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4 mb-4">
          {post.user.image && (
            <div className="relative w-10 h-10">
              <Image
                src={post.user.image}
                alt={post.user.name || ''}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-800">
              {post.user.name}
            </div>
            <time className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true,
                locale: ja 
              })}
            </time>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 line-clamp-2">
          {post.content.replace(/[#*`]/g, '')}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span className="hover:text-blue-600 transition-colors">
            続きを読む →
          </span>
        </div>
      </article>
    </Link>
  )
}