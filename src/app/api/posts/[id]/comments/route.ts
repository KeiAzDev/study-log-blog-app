// src/app/api/posts/[id]/comments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ESLintルールを無効化して、必要なパターンを使用
/* eslint-disable @typescript-eslint/no-explicit-any */

// コメント一覧取得
export async function GET(request: NextRequest, { params }: { params: any }) {
  // Next.js 15.1.6はparamsをawaitする必要がある
  const idParam = await params;
  const logId = idParam.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { logId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "コメントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 新規コメント投稿
export async function POST(request: NextRequest, { params }: { params: any }) {
  const session = await getServerSession(authOptions);
  
  // Next.js 15.1.6はparamsをawaitする必要がある
  const idParam = await params;
  const logId = idParam.id;

  if (!session?.user) {
    return NextResponse.json(
      { error: "認証されていません" },
      { status: 401 }
    );
  }

  try {
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "コメント内容を入力してください" },
        { status: 400 }
      );
    }

    // コメント投稿先の記事が存在するか確認
    const post = await prisma.log.findUnique({
      where: { id: logId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        logId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 }
    );
  }
}