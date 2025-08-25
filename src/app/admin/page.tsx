"use client";

import { useState, useEffect } from "react";
import {
  UsersIcon,
  CreditCardIcon,
  MapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Topbar from "@/components/Topbar";
import UserDetailModal from "@/components/UserDetailModal";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";

interface DashboardStats {
  total_users: number;
  subscribed_users: number;
  total_campaigns: number;
  total_maps: number;
  total_characters: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_verified: boolean;
  is_subaccount: boolean;
  subscription: {
    status: string;
    plan_name: string;
    created_at: string;
    usage_count: number;
  } | null;
}

interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function AdminPanel() {
  const { username, logout } = useLogin();
  const router = useRouter();
  
  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // UI state
  const [activeSection, setActiveSection] = useState<"dashboard" | "users">("dashboard");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check admin authentication - hardcoded approach
  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("🔍 Admin Page: Checking admin status for username:", username);
      
      if (!username) {
        console.log("❌ Admin Page: No username, skipping check");
        return;
      }
      
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/check-auth?email=${encodeURIComponent(username)}`;
        console.log("🌐 Admin Page: Calling URL:", url);
        
        const response = await fetch(url);
        console.log("📡 Admin Page: Response status:", response.status);
        console.log("📡 Admin Page: Response ok:", response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log("📦 Admin Page: Response data:", data);
          
          if (data.authenticated && data.admin) {
            console.log("✅ Admin Page: User is admin, fetching data");
            // User is admin, fetch data
            fetchStats();
            fetchUsers(currentPage, searchQuery);
          } else {
            console.log("❌ Admin Page: User not admin, redirecting to login");
            // Not admin, redirect to admin login
            router.push('/admin/login');
          }
        } else {
          console.log("❌ Admin Page: Response not ok, redirecting to login");
          // Not authenticated, redirect to admin login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error("💥 Admin Page: Error checking admin status:", error);
        router.push('/admin/login');
      }
    };

    checkAdminStatus();
  }, [username, router]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/dashboard/stats?email=${encodeURIComponent(username)}`;
      console.log("📊 Fetching stats from URL:", url);
      console.log("📧 Username being sent:", username);
      
      const response = await fetch(url);
      console.log("📡 Stats response status:", response.status);
      
      const data = await response.json();
      console.log("📦 Stats response data:", data);
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async (page: number = 1, search: string = "") => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "10",
        email: username, // Add email for admin check
        ...(search && { search })
      });

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users?${params}`;
      console.log("👥 Fetching users from URL:", url);
      console.log("📧 Username being sent:", username);
      console.log("🔍 Search params:", params.toString());

      const response = await fetch(url);
      console.log("📡 Users response status:", response.status);
      
      const data = await response.json();
      console.log("📦 Users response data:", data);
      
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(userId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}?email=${encodeURIComponent(username)}`,
        { method: 'DELETE' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh users list
        fetchUsers(currentPage, searchQuery);
        // Refresh stats
        fetchStats();
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user: " + data.error);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle search
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // Handle search input change with debouncing
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle admin logout - clear auth and redirect
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username }),
      });
      
      // Clear local storage and cookies
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      
      // Clear cookies by setting them to expire
      document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Force logout from context
      logout();
      
      // Force page refresh to clear any cached state
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend fails, clear local auth and redirect
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      logout();
      // Force page refresh to clear any cached state
      window.location.href = '/admin/login';
    }
  };

  // Effects for search and pagination
  useEffect(() => {
    if (username) {
      fetchUsers(currentPage, searchQuery);
    }
  }, [currentPage, searchQuery, username]);



  // Show loading while checking authentication
   if (!username) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#1f2433] to-[#1a1f2e] flex items-center justify-center">
         <div className="text-center">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-[#4a4f5e] rounded-full animate-pulse"></div>
             <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
           <p className="text-[#d0d0d0] mt-6 text-lg font-medium">Checking authentication...</p>
           <p className="text-[#808080] mt-2 text-sm">Please wait while we verify your access</p>
         </div>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#1f2433] to-[#1a1f2e] text-white">
      <Topbar />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with animated gradient */}
          <div className="relative mb-8 p-6 bg-gradient-to-r from-[#2a2f3e]/50 to-[#3a3f4e]/50 rounded-2xl backdrop-blur-sm border border-[#4a4f5e]/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30">
                  <ShieldCheckIcon className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-[#a0a0a0] text-sm">Manage your application</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === "dashboard"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 text-[#d0d0d0] border border-[#4a4f5e]/30"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection("users")}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === "users"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 text-[#d0d0d0] border border-[#4a4f5e]/30"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-5 h-5" />
                    <span>User Management</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 rounded-xl transition-all duration-300 transform hover:scale-105 border border-red-500/30 flex items-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

                     {activeSection === "dashboard" && (
             <div className="space-y-6">
               <div className="flex items-center space-x-3 mb-6">
                 <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                 <h2 className="text-2xl font-semibold text-[#e0e0e0]">Dashboard Statistics</h2>
               </div>
               
               {statsLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                   {Array(5).fill(0).map((_, index) => (
                     <div key={index} className="bg-[#2a2f3e]/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-[#4a4f5e]/20">
                       <div className="h-10 w-10 bg-[#3a3f4e] rounded-xl mb-4"></div>
                       <div className="h-8 bg-[#3a3f4e] rounded-lg mb-2"></div>
                       <div className="h-4 bg-[#3a3f4e] rounded w-3/4"></div>
                     </div>
                   ))}
                 </div>
               ) : stats ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                   <div className="group bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                         <UsersIcon className="w-6 h-6 text-blue-400" />
                       </div>
                       <div className="text-2xl text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                     </div>
                     <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">{stats.total_users}</div>
                     <div className="text-[#a0a0a0] text-sm font-medium">Total Users</div>
                   </div>
                   
                   <div className="group bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                         <CreditCardIcon className="w-6 h-6 text-green-400" />
                       </div>
                       <div className="text-2xl text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                     </div>
                     <div className="text-4xl font-bold text-white mb-2 group-hover:text-green-200 transition-colors duration-300">{stats.subscribed_users}</div>
                     <div className="text-[#a0a0a0] text-sm font-medium">Subscribed Users</div>
                   </div>
                   
                   <div className="group bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                         <DocumentTextIcon className="w-6 h-6 text-purple-400" />
                       </div>
                       <div className="text-2xl text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                     </div>
                     <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">{stats.total_campaigns}</div>
                     <div className="text-[#a0a0a0] text-sm font-medium">Campaigns Created</div>
                   </div>
                   
                   <div className="group bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/10">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                         <MapIcon className="w-6 h-6 text-yellow-400" />
                       </div>
                       <div className="text-2xl text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                     </div>
                     <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors duration-300">{stats.total_maps}</div>
                     <div className="text-[#a0a0a0] text-sm font-medium">Maps Created</div>
                   </div>
                   
                   <div className="group bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-xl border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                         <UserGroupIcon className="w-6 h-6 text-indigo-400" />
                       </div>
                       <div className="text-2xl text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                     </div>
                     <div className="text-4xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors duration-300">{stats.total_characters}</div>
                     <div className="text-[#a0a0a0] text-sm font-medium">Characters Created</div>
                   </div>
                 </div>
               ) : (
                 <div className="text-center text-[#a0a0a0] py-12 bg-[#2a2f3e]/40 rounded-2xl border border-[#4a4f5e]/20">
                   <div className="w-16 h-16 mx-auto mb-4 bg-[#3a3f4e] rounded-full flex items-center justify-center">
                     <ExclamationTriangleIcon className="w-8 h-8 text-[#808080]" />
                   </div>
                   <p className="text-lg">Failed to load statistics</p>
                   <p className="text-sm text-[#808080]">Please try refreshing the page</p>
                 </div>
               )}
             </div>
           )}

                     {activeSection === "users" && (
             <div className="space-y-6">
               <div className="flex items-center space-x-3 mb-6">
                 <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                 <h2 className="text-2xl font-semibold text-[#e0e0e0]">User Management</h2>
               </div>
               
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-[#a0a0a0] text-sm">Manage and monitor user accounts</p>
                   {searchQuery && (
                     <p className="text-purple-300 text-sm mt-1">
                       🔍 Searching for: <span className="font-medium">"{searchQuery}"</span>
                     </p>
                   )}
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <div className="relative group">
                     <input
                       type="text"
                       placeholder="Search users..."
                       className="pl-10 pr-4 py-3 bg-[#2a2f3e]/80 backdrop-blur-sm border border-[#4a4f5e]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-[#808080] w-64"
                       value={searchInput}
                       onChange={handleSearchInputChange}
                       onKeyPress={handleSearchKeyPress}
                     />
                     <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#808080] group-focus-within:text-purple-400 transition-colors duration-300" />
                   </div>
                   <button
                     onClick={handleSearch}
                     className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-300 rounded-xl transition-all duration-300 transform hover:scale-105 border border-purple-500/30 flex items-center gap-2"
                   >
                     <MagnifyingGlassIcon className="w-5 h-5" />
                     <span>Search</span>
                   </button>
                   {searchQuery && (
                     <button
                       onClick={() => {
                         setSearchInput("");
                         setSearchQuery("");
                         setCurrentPage(1);
                       }}
                       className="px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 rounded-xl transition-all duration-300 transform hover:scale-105 border border-red-500/30"
                       title="Clear search"
                     >
                       Clear
                     </button>
                   )}
                 </div>
               </div>

                             {usersLoading ? (
                 <div className="bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#4a4f5e]/30">
                   <div className="animate-pulse">
                     {Array(10).fill(0).map((_, index) => (
                       <div key={index} className="p-6 border-b border-[#4a4f5e]/20">
                         <div className="flex items-center justify-between">
                           <div className="space-y-3">
                             <div className="h-5 bg-[#3a3f4e] rounded-lg w-48"></div>
                             <div className="h-4 bg-[#3a3f4e] rounded-lg w-32"></div>
                           </div>
                           <div className="h-10 w-28 bg-[#3a3f4e] rounded-lg"></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <>
                   <div className="bg-gradient-to-br from-[#2a2f3e]/80 to-[#3a3f4e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#4a4f5e]/30 shadow-xl">
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead className="bg-gradient-to-r from-[#1a1f2e]/80 to-[#2a2f3e]/80">
                           <tr>
                             <th className="px-8 py-6 text-left text-sm font-semibold text-[#d0d0d0] uppercase tracking-wider">User</th>
                             <th className="px-8 py-6 text-left text-sm font-semibold text-[#d0d0d0] uppercase tracking-wider">Email</th>
                             <th className="px-8 py-6 text-left text-sm font-semibold text-[#d0d0d0] uppercase tracking-wider">Subscription</th>
                             <th className="px-8 py-6 text-left text-sm font-semibold text-[#d0d0d0] uppercase tracking-wider">Status</th>
                             <th className="px-8 py-6 text-left text-sm font-semibold text-[#d0d0d0] uppercase tracking-wider">Actions</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-[#4a4f5e]/20">
                           {users.map((user, index) => (
                             <tr 
                               key={user.id} 
                               className="group hover:bg-[#3a3f4e]/50 transition-all duration-300 transform hover:scale-[1.01]"
                               style={{ animationDelay: `${index * 50}ms` }}
                             >
                               <td className="px-8 py-6">
                                 <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                                     <span className="text-sm font-semibold text-purple-300">
                                       {user.first_name?.[0] || user.username[0]?.toUpperCase()}
                                     </span>
                                   </div>
                                   <div>
                                     <div className="font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                                       {user.first_name && user.last_name 
                                         ? `${user.first_name} ${user.last_name}`
                                         : user.username
                                       }
                                     </div>
                                     <div className="text-sm text-[#808080]">ID: {user.id}</div>
                                   </div>
                                 </div>
                               </td>
                               <td className="px-8 py-6">
                                 <div className="text-sm text-[#d0d0d0] group-hover:text-white transition-colors duration-300">
                                   {user.email}
                                 </div>
                               </td>
                               <td className="px-8 py-6">
                                 {user.subscription ? (
                                   <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-3 border border-green-500/20">
                                     <div className="text-sm font-medium text-green-300">{user.subscription.plan_name}</div>
                                     <div className="text-xs text-green-400/70">
                                       Usage: {user.subscription.usage_count}
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="bg-gradient-to-r from-[#3a3f4e]/50 to-[#4a4f5e]/50 rounded-lg p-3 border border-[#5a5f6e]/30">
                                     <span className="text-sm text-[#808080]">No subscription</span>
                                   </div>
                                 )}
                               </td>
                               <td className="px-8 py-6">
                                 <div className="flex flex-col gap-2">
                                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                     user.is_verified
                                       ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                       : "bg-red-500/20 text-red-300 border border-red-500/30"
                                   }`}>
                                     {user.is_verified ? "✓ Verified" : "✗ Unverified"}
                                   </span>
                                   {user.is_subaccount && (
                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                       Subaccount
                                     </span>
                                   )}
                                 </div>
                               </td>
                               <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                   <button
                                     onClick={() => {
                                       setSelectedUserId(user.id);
                                       setIsModalOpen(true);
                                     }}
                                     className="p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-300 transform hover:scale-110 border border-blue-500/20 hover:border-blue-500/40"
                                     title="View Details"
                                   >
                                     <EyeIcon className="w-5 h-5" />
                                   </button>
                                   <button
                                     onClick={() => deleteUser(user.id)}
                                     disabled={deleteLoading === user.id}
                                     className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 transform hover:scale-110 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                     title="Delete User"
                                   >
                                     {deleteLoading === user.id ? (
                                       <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                     ) : (
                                       <TrashIcon className="w-5 h-5" />
                                     )}
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                   
                   {/* No results message */}
                   {users.length === 0 && searchQuery && (
                     <div className="text-center py-12 bg-gradient-to-r from-[#2a2f3e]/40 to-[#3a3f4e]/40 rounded-2xl border border-[#4a4f5e]/20">
                       <div className="w-16 h-16 mx-auto mb-4 bg-[#3a3f4e] rounded-full flex items-center justify-center">
                         <MagnifyingGlassIcon className="w-8 h-8 text-[#808080]" />
                       </div>
                       <p className="text-lg text-[#d0d0d0] mb-2">No users found</p>
                       <p className="text-sm text-[#808080]">No users match your search for "{searchQuery}"</p>
                       <button
                         onClick={() => {
                           setSearchInput("");
                           setSearchQuery("");
                           setCurrentPage(1);
                         }}
                         className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-300 rounded-lg transition-all duration-300 border border-purple-500/30"
                       >
                         Clear Search
                       </button>
                     </div>
                   )}

                                     {/* Pagination */}
                   {pagination && pagination.pages > 1 && (
                     <div className="flex items-center justify-between bg-gradient-to-r from-[#2a2f3e]/60 to-[#3a3f4e]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#4a4f5e]/20">
                       <div className="text-sm text-[#a0a0a0]">
                         Showing <span className="font-semibold text-white">{((pagination.page - 1) * pagination.per_page) + 1}</span> to{' '}
                         <span className="font-semibold text-white">{Math.min(pagination.page * pagination.per_page, pagination.total)}</span> of{' '}
                         <span className="font-semibold text-white">{pagination.total}</span> results
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <button
                           onClick={() => handlePageChange(pagination.page - 1)}
                           disabled={!pagination.has_prev}
                           className="p-3 bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 disabled:hover:bg-[#2a2f3e]/80 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50"
                         >
                           <ChevronLeftIcon className="w-5 h-5 text-[#d0d0d0]" />
                         </button>
                         
                         {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                           .filter(page => {
                             return Math.abs(page - pagination.page) <= 2 || page === 1 || page === pagination.pages;
                           })
                           .map((page, index, array) => {
                             if (index > 0 && page - array[index - 1] > 1) {
                               return [
                                 <span key={`ellipsis-${page}`} className="px-4 py-3 text-[#808080] font-medium">...</span>,
                                 <button
                                   key={page}
                                   onClick={() => handlePageChange(page)}
                                   className={`px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                     page === pagination.page
                                       ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                                       : "bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 text-[#d0d0d0] border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50"
                                   }`}
                                 >
                                   {page}
                                 </button>
                               ];
                             }
                             return (
                               <button
                                 key={page}
                                 onClick={() => handlePageChange(page)}
                                 className={`px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                   page === pagination.page
                                     ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                                     : "bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 text-[#d0d0d0] border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50"
                                 }`}
                               >
                                 {page}
                               </button>
                             );
                           })}
                         
                         <button
                           onClick={() => handlePageChange(pagination.page + 1)}
                           disabled={!pagination.has_next}
                           className="p-3 bg-[#2a2f3e]/80 hover:bg-[#3a3f4e]/80 disabled:hover:bg-[#2a2f3e]/80 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50"
                         >
                           <ChevronRightIcon className="w-5 h-5 text-[#d0d0d0]" />
                         </button>
                       </div>
                     </div>
                   )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
        }}
        adminEmail={username}
      />
    </div>
  );
}