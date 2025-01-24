"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  error,
}: MarkdownEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-4 h-[500px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="Markdown形式で入力してください"
        />
        <div className="w-full h-full p-4 border rounded-lg overflow-y-auto prose prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "# プレビュー\nここに内容が表示されます"}
          </ReactMarkdown>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
