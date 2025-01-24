// src/app/posts/[id]/edit/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { EditPostForm } from './edit-post-form'

async function getPost(id: string) {
  const post = await prisma.log.findUnique({ where: { id } })
  if (!post) redirect('/posts')
  return post
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const [session, post] = await Promise.all([
    getServerSession(authOptions),
    getPost(id)
  ])

  if (!session?.user || !isAdmin(session.user.email)) {
    redirect('/posts')
  }

  return <EditPostForm post={post} />
}