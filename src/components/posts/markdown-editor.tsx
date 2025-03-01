"use client";

import React, { useRef, useEffect, useState } from "react";

// クライアントサイドのみで動作するコンポーネント
const ClientMarkdownPreview = ({ content }: { content: string }) => {
  const [markdownComponents, setMarkdownComponents] = useState<{
    ReactMarkdown?: React.ElementType;
    remarkGfm?: unknown;
  }>({});

  useEffect(() => {
    // コンポーネントがマウントされた後に動的にインポート
    const loadComponents = async () => {
      try {
        const [reactMarkdownModule, remarkGfmModule] = await Promise.all([
          import("react-markdown"),
          import("remark-gfm")
        ]);
        
        setMarkdownComponents({
          ReactMarkdown: reactMarkdownModule.default,
          remarkGfm: remarkGfmModule.default
        });
      } catch (error) {
        console.error("Error loading markdown components:", error);
      }
    };

    loadComponents();
  }, []);

  if (!markdownComponents.ReactMarkdown) {
    return <div className="p-4 text-gray-500">プレビューを読み込み中...</div>;
  }

  const { ReactMarkdown, remarkGfm } = markdownComponents;

  return (
    <ReactMarkdown 
      remarkPlugins={remarkGfm ? [remarkGfm] : []} 
      className="prose prose-indigo max-w-none"
    >
      {content || "# プレビュー\nここに内容が表示されます"}
    </ReactMarkdown>
  );
};

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

type FormatAction = "bold" | "italic" | "heading" | "code" | "link" | "list" | "orderedList" | "quote";

export function MarkdownEditor({
  value,
  onChange,
  label,
  error,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // サーバーサイドレンダリング時にエラーを起こさないためのフラグ
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // カーソル位置にフォーマットを適用する関数
  const applyFormat = (action: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    let formattedText = selectedText;
    let cursorOffset = 0;

    switch (action) {
      case "bold":
        formattedText = `**${selectedText || "太字テキスト"}**`;
        cursorOffset = selectedText ? 0 : 4;
        break;
      case "italic":
        formattedText = `*${selectedText || "斜体テキスト"}*`;
        cursorOffset = selectedText ? 0 : 5;
        break;
      case "heading":
        formattedText = `\n## ${selectedText || "見出し"}\n`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case "code":
        formattedText = `\`\`\`\n${selectedText || "コードブロック"}\n\`\`\``;
        cursorOffset = selectedText ? 0 : 6;
        break;
      case "link":
        formattedText = `[${selectedText || "リンクテキスト"}](URL)`;
        cursorOffset = selectedText ? 3 : 8;
        break;
      case "list":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `- ${line}`)
              .join("\n")
          : "- リスト項目";
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "orderedList":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line, i) => `${i + 1}. ${line}`)
              .join("\n")
          : "1. リスト項目";
        cursorOffset = selectedText ? 0 : 3;
        break;
      case "quote":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `> ${line}`)
              .join("\n")
          : "> 引用テキスト";
        cursorOffset = selectedText ? 0 : 2;
        break;
    }

    const newValue =
      value.substring(0, selectionStart) +
      formattedText +
      value.substring(selectionEnd);

    onChange(newValue);

    // テキストエリアにフォーカスを戻し、適切な位置にカーソルを配置
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newCursorPosition = selectionStart + formattedText.length - cursorOffset;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* ツールバー */}
      <div className="flex flex-wrap gap-1 border border-gray-300 rounded-t-lg p-2 bg-gray-50">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="太字 (Ctrl+B)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 3h-3a3 3 0 00-3 3v12a3 3 0 003 3h3a4.5 4.5 0 004.5-4.5V13.5a3 3 0 00-3-3h-3a1.5 1.5 0 01-1.5-1.5V7.5A1.5 1.5 0 0110.5 6h3a1.5 1.5 0 011.5 1.5v1.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="斜体 (Ctrl+I)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m-4-4l-4-4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("heading")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="見出し"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("link")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="リンク (Ctrl+K)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("list")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="箇条書きリスト"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M8 6V4m0 8V8m0 8v-2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("orderedList")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="番号付きリスト"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h12M7 12h12M7 17h12M4 8h1M4 12h1M4 16h1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("code")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="コードブロック"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("quote")}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
          title="引用"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>

      {/* エディター部分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-[500px] p-4 border rounded-b-lg md:rounded-bl-lg md:rounded-br-none border-gray-300 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              error ? "border-red-500" : ""
            }`}
            placeholder="Markdown形式で入力してください"
          />
        </div>

        {/* プレビュー部分 - クライアントサイドでのみレンダリング */}
        <div className="w-full h-[500px] p-4 border rounded-b-lg md:rounded-bl-none md:rounded-br-lg border-gray-300 overflow-y-auto bg-white">
          {isMounted ? <ClientMarkdownPreview content={value} /> : <p>プレビューを読み込み中...</p>}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}