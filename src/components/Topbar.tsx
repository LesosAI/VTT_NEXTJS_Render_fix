"use client";

import { useState } from "react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useLogin } from "@/context/LoginContext";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { username, logout } = useLogin();

  return (
    <div className="bg-[#1a1f2e] p-4 flex justify-between items-center border-b border-gray-700/30">
      <div className="relative">
        <button
          id="topbar-menu-button"
          className="p-2 hover:bg-[#3a3f4e] rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div
          id="topbar-menu"
          className={`absolute left-0 mt-2 w-48 bg-[#1a1f2e] rounded-lg shadow-lg py-2 z-10 border border-gray-700/30 ${isMenuOpen ? "block" : "invisible"
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
