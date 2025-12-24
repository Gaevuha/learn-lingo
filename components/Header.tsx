"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export default function Header() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("Sign out successful", "success");
    } catch (error) {
      showToast("Sign out error", "error");
    }
  };

  return (
    <header className="bg-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <div className="h-1/2 bg-blue-500" />
            <div className="h-1/2 bg-yellow-400" />
          </div>
          <span className="text-xl font-semibold text-white">LearnLingo</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-gray-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/teachers" className="hover:text-white transition">
            Teachers
          </Link>
          {isAuthenticated && (
            <Link href="/favorites" className="hover:text-white transition">
              Favorites
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-white">
                Hello, {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <span className="text-yellow-400 text-lg">↪</span>
                Log in
              </Link>

              <Link
                href="/auth/register"
                className="px-6 py-3 bg-[#1C1F23] text-white rounded-full font-medium hover:bg-[#2A2E33] transition"
              >
                Registration
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
