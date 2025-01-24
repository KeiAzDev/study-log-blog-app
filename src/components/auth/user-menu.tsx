"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";

export const UserMenu = () => {
  const { data: session } = useSession(); 

  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <div className="relative w-8 h-8">
            <Image
              src={session.user.image}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
        <span className="font-medium">{session.user?.name}</span>
      </div>
      <Button variant="ghost" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
};
