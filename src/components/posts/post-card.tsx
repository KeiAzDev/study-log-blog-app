"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user?: {
      name: string;
      image?: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // クライアントサイドでのみ日付をフォーマット
    setFormattedDate(
      formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ja,
      })
    );
  }, [post.createdAt]);

  // マークダウン記号を取り除いてプレーンテキスト化
  const plainText = post.content
    .replace(/#{1,6}\s+/g, "") // 見出し記号を削除
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // 強調記号を削除
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // コードブロックを削除
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンクを削除
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 画像を削除
    .replace(/\n/g, " "); // 改行を空白に置換

  return (
    <Link href={`/posts/${post.id}`} className="block h-full group">
      <article className="bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group-hover:border-indigo-100">
        <div className="p-6 flex flex-col h-full">
          {/* 投稿メタデータ */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                {"K"}
              </div>
              <span className="text-sm text-gray-700">
                {"K"}
              </span>
            </div>
            <time className="text-xs text-gray-500">
              {isMounted ? formattedDate : ""}
            </time>
          </div>

          {/* 投稿内容 */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-600 line-clamp-3 text-sm">
              {plainText}
            </p>
          </div>

          {/* 続きを読むリンク */}
          <div className="mt-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-800 flex items-center transition-all">
            <span>続きを読む</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}