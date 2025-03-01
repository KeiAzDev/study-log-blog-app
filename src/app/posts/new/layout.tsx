import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-utils";

export default async function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.email)) {
    redirect("/posts");
  }

  // 認証が通った場合は、コンテンツをレンダリング
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {children}
    </div>
  );
}