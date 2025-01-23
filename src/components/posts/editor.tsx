"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Editor() {
  const [content, setContent] = useState("");

  return (
    <div className="max-w-4xl mx-auto">
      <form className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="タイトル"
            className="w-full px-4 py-2 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 h-[600px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdown形式で記事を書く"
            className="p-4 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="p-4 rounded-lg bg-slate-50 overflow-y-auto prose prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || "# プレビュー\nここに記事が表示されます"}
            </ReactMarkdown>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          投稿する
        </button>
      </form>
    </div>
  );
}
