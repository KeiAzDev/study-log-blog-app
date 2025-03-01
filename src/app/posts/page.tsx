import { PostCard } from "@/components/posts/post-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
}

export default async function PostsPage() {
  const [session, postsResponse] = await Promise.all([
    getServerSession(authOptions),
    fetch("https://study-log-blog-app.vercel.app/api/posts", {
      cache: "no-store",
    }),
  ]);

  if (!postsResponse.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await postsResponse.json();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">学習記録</h1>
        {session?.user?.isAdmin && (
          <Link
            href="/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新規投稿
          </Link>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">投稿がありません</h2>
          <p className="mt-2 text-gray-500">最初の学習記録を投稿しましょう！</p>
          {session?.user?.isAdmin && (
            <Link
              href="/posts/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              最初の投稿を作成
            </Link>
          )}
        </div>
      )}
    </div>
  );
}