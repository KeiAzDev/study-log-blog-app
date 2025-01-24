import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { EditPostForm } from "./edit-post-form";

export type PageProps = {
 params: { 
   id: string;
   [Symbol.toStringTag]: string;
   then: <TResult1, TResult2>(
     onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null, 
     onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
   ) => Promise<TResult1 | TResult2>;
   catch: (onrejected?: ((reason: unknown) => unknown) | null) => Promise<unknown>;
   finally: (onfinally?: (() => void) | null) => Promise<unknown>;
 };
};

export default async function EditPostPage({ params }: PageProps) {
 const { id } = params;
 const [session, post] = await Promise.all([
   getServerSession(authOptions),
   prisma.log.findUnique({
     where: { id },
     include: {
       user: {
         select: { name: true },
       },
     },
   }),
 ]);

 if (!post) notFound();

 const isAuthorized = session?.user && isAdmin(session.user.email);
 
 if (!isAuthorized) {
   notFound();
 }

 return <EditPostForm post={post} />;
}