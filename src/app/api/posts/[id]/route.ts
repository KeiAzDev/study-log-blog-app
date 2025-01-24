import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-utils";

interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.log.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content }: UpdatePostRequest = await req.json();
    if (!title && !content) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const post = await prisma.log.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if(!session?.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        {error: 'Unauthorized'},
        {status: 401}
      )
    }

    await prisma.log.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({message: 'Post deleted successfully'})
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
