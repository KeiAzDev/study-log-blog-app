"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MarkdownEditor } from "@/components/posts/markdown-editor";

export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{title?: string; content?: string}>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // 入力検証
    const newErrors: {title?: string; content?: string} = {};
    if (!title.trim()) newErrors.title = "タイトルを入力してください";
    if (!content.trim()) newErrors.content = "本文を入力してください";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!session?.user.isAdmin) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/posts");
      router.refresh(); // 一覧ページの更新を強制
    } catch (error) {
      console.error("Error details:", error);
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 text-gray-900">新規投稿</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="タイトルを入力してください"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <MarkdownEditor 
          value={content} 
          onChange={setContent} 
          label="本文" 
          error={errors.content}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting 
              ? "bg-indigo-400 text-white cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              投稿中...
            </span>
          ) : "投稿する"}
        </button>
      </form>
    </>
  );
}