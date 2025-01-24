"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("本当に削除しますか？")) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      router.push("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "削除"}
    </button>
  );
}
