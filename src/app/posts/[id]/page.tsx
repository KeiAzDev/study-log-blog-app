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

export type PageProps = {
  params: { 
    id: string;
    [Symbol.toStringTag]: string;
    then: <TResult1, TResult2>(
      onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null, 
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ) => Promise<TResult1 | TResult2>;
    catch: (onrejected?: ((reason: unknown) => unknown) | null) => Promise<unknown>;
    finally: (onfinally?: (() => void) | null) => Promise<unknown>;
  };
};

async function getPost(id: string) {
  const post = await prisma.log.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
  if (!post) notFound();
  return post;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = params;
  const [session, post] = await Promise.all([
    getServerSession(authOptions),
    getPost(id),
  ]);

  const isAuthorized = session?.user && isAdmin(session.user.email);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-50 rounded-lg shadow-sm p-8">
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
    </div>
  );
}