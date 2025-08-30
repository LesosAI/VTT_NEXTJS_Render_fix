"use client";

import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ArrowsUpDownIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import clsx from "clsx";
import Tour from "@/components/Tour";
import DashboardStats from "@/components/DashboardStats";

interface Character {
  id: number;
  image_url: string;
  description: string;
  style: string;
  tags: string[];
  created_at: string;
  type: "character";
}

interface Map {
  id: number;
  image_url: string;
  description: string;
  style: string;
  tone: string;
  created_at: string;
  type: "map";
}

interface Subscription {
  status: string;
  plan: {
    name: string;
    description: string;
    price: number;
    interval: string;
    usage_limit: number | null;
  };
  usage_count: number;
  current_period_start: string;
  current_period_end: string;
}

interface DashboardStats {
  total_users: number;
  subscribed_users: number;
  total_campaigns: number;
  total_maps: number;
  total_characters: number;
}

export default function Dashboard() {
  const { username } = useLogin();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [images, setImages] = useState<Character[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasGameMaster, setHasGameMaster] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charactersResponse, mapsResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character-history/${username}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/map-history/${username}`
          ),
        ]);

        const charactersData = await charactersResponse.json();
        const mapsData = await mapsResponse.json();

        if (charactersData.success) {
          setImages(
            charactersData.characters.map((char: Omit<Character, "type">) => ({
              ...char,
              type: "character",
            }))
          );
        }
        if (mapsData.success) {
          setMaps(
            mapsData.maps.map((map: Omit<Map, "type">) => ({
              ...map,
              type: "map",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/permissions`
        );
        if (response.ok) {
          const data = await response.json();
          setHasGameMaster(data.permissions.includes("Game Master"));
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription`
        );
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        console.log("🔍 Fetching dashboard stats...");
        // TODO: Move this to environment variable NEXT_PUBLIC_API_BASE_URL
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        console.log("🌍 API Base URL:", apiBaseUrl);
        // The backend requires admin email parameter for authentication
        const url = `${apiBaseUrl}/admin/stats?email=${encodeURIComponent(username)}`;
        console.log("🔗 Full URL:", url);
        const response = await fetch(url);
        console.log("📊 Dashboard stats response:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("📊 Dashboard stats data:", data);
          setDashboardStats(data);
        } else {
          console.error("❌ Failed to fetch dashboard stats:", response.status);
          const errorText = await response.text();
          console.error("❌ Error response:", errorText);
        }
      } catch (error) {
        console.error("💥 Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (username) {
      fetchData();
      fetchPermissions();
      fetchSubscription();
      fetchDashboardStats();
    }
  }, [username]);

  // Mock data
  const mockImages = [
    {
      id: 1,
      title: "Fantasy Character",
      type: "character",
      tags: ["warrior", "fantasy"],
      date: "2024-03-20",
    },
    {
      id: 2,
      title: "Medieval Town Map",
      type: "map",
      tags: ["town", "medieval"],
      date: "2024-03-19",
    },
    {
      id: 3,
      title: "Dragon Campaign",
      type: "campaign",
      tags: ["dragon", "epic"],
      date: "2024-03-18",
    },
    // Add more mock items as needed
  ];

  const filteredAndSortedItems = [...images, ...maps]
    .filter((item) => {
      // Filter by date range
      const itemDate = new Date(item.created_at);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      const matchesDate =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      // Filter by search query (tags for characters, description for maps)
      const matchesSearch =
        !searchQuery ||
        ("tags" in item
          ? item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
          : item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <Tour />
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Upgrade Prompt for Free Users */}
            {!subscriptionLoading && subscription && subscription.plan.name === 'Free' && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Upgrade to Game Master</h3>
                    <p className="text-purple-100 text-sm">
                      Unlock campaign and map creation features
                    </p>
                  </div>
                  <Link
                    href="/select-plan"
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Sort Button */}
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="flex items-center gap-2 px-3 py-2.5 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors"
                title={`Sort by ${sortOrder === "newest" ? "oldest" : "newest"
                  }`}
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
              </button>

              {/* Date Range Inputs */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="px-3 py-2.5 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  className="px-3 py-2.5 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search for tags..."
                className="w-full sm:w-64 px-4 py-2.5 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Generate Button */}
              <div className="relative flex justify-end">
                <button
                  id="generate-btn"
                  onClick={() => setIsGenerateOpen(!isGenerateOpen)}
                  className="px-6 py-2.5 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                >
                  Generate <ChevronDownIcon className="w-4 h-4" />
                </button>

                <div
                  id="generation-options"
                  className={clsx(
                    "absolute top-full left-0 mt-2 w-48 bg-[#2a2f3e] rounded-lg shadow-lg py-2 z-10 border border-gray-700/30 max-w-[calc(100vw-2rem)] transition-all",
                    isGenerateOpen ? "block" : "invisible pointer-events-none"
                  )}
                >
                  <Link
                    href="/create/character"
                    className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
                  >
                    Create Character
                  </Link>
                  {hasGameMaster ? (
                    <>
                      <Link
                        href="/create/map"
                        className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
                      >
                        Create Map
                      </Link>
                      <Link
                        href="/create/campaign"
                        className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block"
                      >
                        Create Campaign
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/select-plan"
                        className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block text-gray-400"
                      >
                        Create Map (Game Master Only)
                      </Link>
                      <Link
                        href="/select-plan"
                        className="w-full px-4 py-2 text-left hover:bg-[#3a3f4e] transition-colors block text-gray-400"
                      >
                        Create Campaign (Game Master Only)
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Dashboard Statistics Cards */}
            {!statsLoading && dashboardStats && (
              <>
                {console.log("🎯 Rendering DashboardStats with stats:", dashboardStats)}
                <DashboardStats stats={dashboardStats} />
              </>
            )}
            
            {loading ? (
              <>
                {/* Skeleton Loader for Characters */}
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    <Skeleton width={200} />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={`skeleton-character-${index}`}
                          className="bg-[#2a2f3e] rounded-lg overflow-hidden cursor-pointer"
                        >
                          <div className="aspect-video bg-[#3a3f4e] flex items-center justify-center relative">
                            <Skeleton width="100%" height="100%" />
                          </div>
                          <div className="p-4">
                            <Skeleton width="150px" />
                            <Skeleton width="100px" />
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Skeleton Loader for Maps */}
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    <Skeleton width={200} />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={`skeleton-map-${index}`}
                          className="bg-[#2a2f3e] rounded-lg cursor-pointer overflow-hidden"
                        >
                          <Skeleton width="100%" height="200px" />
                          <div className="p-3 sm:p-4">
                            <Skeleton width="100px" />
                            <Skeleton width="100%" />
                            <Skeleton width="80px" />
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                {filteredAndSortedItems.filter((item) => item.type === "character").length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Characters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAndSortedItems
                        .filter((item) => item.type === "character")
                        .map((item) => (
                          <div
                            key={`character-${item.id}`}
                            className="bg-[#2a2f3e] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 hover:bg-[#3a3f4e] transition-all"
                            onClick={() => router.push(`/character/${item.id}`)}
                          >
                            <div className="aspect-video bg-[#3a3f4e] flex items-center justify-center relative">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.description}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-400">No Image Available</span>
                              )}
                              <span className="absolute top-2 right-2 px-2 py-1 bg-[#1a1f2e]/80 rounded-full text-sm">
                                {item.type}
                              </span>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium mb-2">{item.description}</h3>
                              <p className="text-sm text-gray-400">
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {filteredAndSortedItems.filter((item) => item.type === "map").length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Maps</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAndSortedItems
                        .filter((item) => item.type === "map")
                        .map((map) => (
                          <div
                            key={`map-${map.id}`}
                            className="bg-[#2a2f3e] rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 hover:bg-[#3a3f4e] overflow-hidden"
                          >
                            <img
                              src={map.image_url}
                              alt="Generated map"
                              className="w-full h-36 sm:h-48 object-cover"
                            />
                            <div className="p-3 sm:p-4">
                              <p className="text-sm text-gray-300 mb-2">Style: {map.style}</p>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {map.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(map.created_at).toLocaleDateString()}
                              </p>
                              <button
                                onClick={() => window.open(map.image_url, "_blank")}
                                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                              >
                                Download Map
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {filteredAndSortedItems.filter((item) => item.type === "character" || item.type === "map")
                  .length === 0 && (
                    <p className="text-white text-lg text-center">No items found</p>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
