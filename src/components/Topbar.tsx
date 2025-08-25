"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useLogin } from "@/context/LoginContext";
import { usePathname } from "next/navigation";

// Admin Panel Link Component
const AdminPanelLink = ({ username }: { username: string }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("🔍 Topbar: Checking admin status for username:", username);
      
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/check-auth?email=${encodeURIComponent(username)}`;
        console.log("🌐 Calling URL:", url);
        
        const response = await fetch(url);
        console.log("📡 Response status:", response.status);
        console.log("📡 Response ok:", response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log("📦 Response data:", data);
          const isAdminUser = data.authenticated && data.admin;
          console.log("👑 Is admin user:", isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
          console.log("❌ Response not ok, status:", response.status);
        }
      } catch (error) {
        console.error("💥 Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      checkAdminStatus();
    } else {
      console.log("🔍 Topbar: No username, skipping admin check");
    }
  }, [username]);

  if (loading || !isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block text-purple-400"
    >
      Admin Panel
    </Link>
  );
};

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { username, logout } = useLogin();
  const pathname = usePathname();
  
  // Hide hamburger menu on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="bg-[#1a1f2e] p-4 flex justify-between items-center border-b border-gray-700/30 relative z-40">
      <div className="relative">
        {!isAdminPage && (
          <button
            id="topbar-menu-button"
            className="p-2 hover:bg-[#3a3f4e] rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}

        {!isAdminPage && (
          <div
            id="topbar-menu"
            className={`absolute left-0 mt-2 w-48 bg-[#1a1f2e]/95 backdrop-blur-sm rounded-lg shadow-2xl py-2 z-50 border border-gray-700/30 transition-all duration-200 ${
              isMenuOpen 
                ? "opacity-100 visible scale-100" 
                : "opacity-0 invisible scale-95"
            }`}
          >
          <Link
            href="/dashboard"
            className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
          >
            Dashboard
          </Link>
          <Link
            href="/account"
            className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
          >
            My Account
          </Link>
          <Link
            href="/plans"
            className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
          >
            Plans
          </Link>
          <Link
            href="/billing"
            className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
          >
            Billing and Services
          </Link>
          {username && !isAdminPage && (
            <AdminPanelLink username={username} />
          )}
          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block text-red-400"
          >
            Logout
          </button>
        </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white">{username}</span>
        <Link
          href="/account"
          className="p-2 hover:bg-[#3a3f4e] rounded-lg transition-colors"
        >
          <UserCircleIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
