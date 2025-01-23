import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

async function getPost(id: string) {
  const post = await prisma.log.findUnique({
    where: {id},
    include: {
      user: {
        select: {name: true}
      }
    }
  })
  if (!post) notFound()
    return post
}

export default async function PostPage({params}: {params: {id: string}}) {
  const post = await getPost(params.id)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-50 rounded-lg shadow-sm p-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>K</span>
            <time>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ja
              })}
            </time>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}