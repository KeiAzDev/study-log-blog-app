import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import DeletePostButton from "./delete-post-button";
import Link from "next/link";
import { Comments } from "@/components/posts/comments";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Next.js 15.1.6のPagePropsの型定義に合わせる
export default async function PostPage({ params }: { params: any }) {
  try {
    // paramsを非同期で解決
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const [session, post] = await Promise.all([
      getServerSession(authOptions),
      prisma.log.findUnique({
        where: { id },
        include: {
          user: {
            select: { name: true },
          },
        },
      }),
    ]);

    // 投稿が見つからない場合は404
    if (!post) notFound();

    const isAuthorized = session?.user && isAdmin(session.user.email);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-50 rounded-lg shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>K</span>
                <time>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </time>
              </div>
            </div>
            {isAuthorized && (
              <div className="flex gap-4">
                <Link
                  href={`/posts/${id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  編集
                </Link>
                <DeletePostButton postId={id} />
              </div>
            )}
          </div>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* コメントセクション */}
        <Comments postId={id} />
      </div>
    );
  } catch (error) {
    console.error("Error loading post:", error);
    notFound();
  }
}