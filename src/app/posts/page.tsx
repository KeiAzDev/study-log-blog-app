import { Suspense } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/posts/post-card";

export default async function PostsPage() {
  const session = await getServerSession(authOptions)
  const posts = await prisma.log.findMany({
    orderBy: {
      createdAt : 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            学習ログ
          </h1>
          {session?.user.isAdmin && (
            <Link href='/posts/new' className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:right-2 focus:ring-offset-2 focus:ring-blue-500" >
              新規投稿
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              まだ投稿がありません
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
