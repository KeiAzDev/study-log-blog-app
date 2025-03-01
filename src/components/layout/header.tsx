"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "../auth/login-button";
import LogoutButton from "../auth/logout-button";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Learning Log
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/posts"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                記事一覧
              </Link>
              {session?.user?.isAdmin && (
                <Link
                  href="/posts/new"
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  新規投稿
                </Link>
              )}
            </nav>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                  {session.user?.image ? (
                    <div className="relative w-8 h-8 overflow-hidden rounded-full">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        className="rounded-full"
                        fill
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <LogoutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">メニューを開く</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/posts"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              記事一覧
            </Link>
            {session?.user?.isAdmin && (
              <Link
                href="/posts/new"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                新規投稿
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session ? (
              <>
                <div className="flex items-center px-4">
                  {session.user?.image ? (
                    <div className="flex-shrink-0 relative h-10 w-10">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        className="rounded-full"
                        fill
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="block px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4 py-2">
                <LoginButton />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}