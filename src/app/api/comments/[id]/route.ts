// src/app/api/comments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

// ESLintルールを無効化して、必要なパターンを使用
/* eslint-disable @typescript-eslint/no-explicit-any */

// コメント削除
export async function DELETE(request: NextRequest, { params }: { params: any }) {
  const session = await getServerSession(authOptions);
  
  // Next.js 15.1.6はparamsをawaitする必要がある
  const idParam = await params;
  const commentId = idParam.id;

  if (!session?.user) {
    return NextResponse.json(
      { error: "認証されていません" },
      { status: 401 }
    );
  }

  try {
    // コメントを取得
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "コメントが見つかりません" },
        { status: 404 }
      );
    }

    // コメントの投稿者か管理者のみ削除可能
    if (comment.userId !== session.user.id && !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "コメントを削除する権限がありません" },
        { status: 403 }
      );
    }

    // コメントを削除
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "コメントの削除に失敗しました" },
      { status: 500 }
    );
  }
}