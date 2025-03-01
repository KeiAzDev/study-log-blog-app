"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface CommentProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ErrorResponse {
  error: string;
}

export function Comments({ postId }: CommentProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // コメントを取得するメソッドをuseCallbackで定義
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      // APIが実装されていない場合は静かに失敗して空の配列を返す
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        
        if (res.ok) {
          const data = await res.json() as Comment[];
          setComments(data);
        } else {
          console.warn("Comments API not found or returned an error. This is expected if you haven't implemented the API yet.");
          setComments([]);
        }
      } catch (err) {
        console.warn("Comments API might not be implemented yet:", err);
        setComments([]);
      }
    } catch (err) {
      console.error("Error in comments handling:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 初回レンダリング時にコメントを取得
  useEffect(() => {
    // マウント後にのみ実行
    if (typeof window !== 'undefined') {
      fetchComments();
    }
  }, [fetchComments]);

  // コメントを投稿
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError("コメントを入力してください");
      return;
    }

    if (!session) {
      setError("コメントを投稿するにはログインが必要です");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "APIがまだ実装されていません" })) as ErrorResponse;
        throw new Error(errorData.error || "コメントの投稿に失敗しました");
      }

      const newCommentData = await res.json() as Comment;
      
      // コメント一覧を更新
      setComments(prev => [newCommentData, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err instanceof Error ? err.message : "コメントの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // コメントを削除
  const handleDelete = async (commentId: string) => {
    if (!confirm("このコメントを削除しますか？")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "APIがまだ実装されていません" })) as ErrorResponse;
        throw new Error(errorData.error || "コメントの削除に失敗しました");
      }

      // コメント一覧から削除したコメントを除外
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err instanceof Error ? err.message : "コメントの削除に失敗しました");
    }
  };

  return (
    <div className="my-10">
      <h2 className="text-xl font-bold mb-6">コメント</h2>

      {/* コメント投稿フォーム */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="コメントを入力してください"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? "bg-indigo-400 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "送信中..." : "コメントを投稿"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">コメントを投稿するには、ログインしてください</p>
        </div>
      )}

      {/* コメント一覧 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {comment.user.image ? (
                    <div className="relative h-10 w-10 mr-3">
                      <Image
                        src={comment.user.image}
                        alt={comment.user.name || ""}
                        className="rounded-full"
                        fill
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                      {comment.user.name?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{comment.user.name || "匿名ユーザー"}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </p>
                  </div>
                </div>

                {/* 自分のコメントか管理者の場合は削除ボタンを表示 */}
                {(session?.user.id === comment.userId || session?.user.isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="コメントを削除"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-2 text-gray-700 whitespace-pre-line">{comment.content}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>まだコメントはありません</p>
            <p className="text-sm mt-2">最初のコメントを投稿しましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
}