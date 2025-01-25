import { PostCard } from "@/components/posts/post-card";

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
  const res = await fetch("https://study-log-blog-app.vercel.app/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await res.json(); // 型アサーション

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
  );
}

