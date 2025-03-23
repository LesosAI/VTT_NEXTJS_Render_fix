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

interface Character {
  id: number;
  image_url: string;
  description: string;
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/check-permissions?username=${username}`
        );
        const data = await response.json();
        setHasGameMaster(data.has_game_master);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    if (username) {
      fetchData();
      fetchPermissions();
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

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Sort Button */}
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="flex items-center gap-2 px-3 py-2.5 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors"
                title={`Sort by ${
                  sortOrder === "newest" ? "oldest" : "newest"
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
                  onClick={() => setIsGenerateOpen(!isGenerateOpen)}
                  className="px-6 py-2.5 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                >
                  Generate <ChevronDownIcon className="w-4 h-4" />
                </button>

                {isGenerateOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#2a2f3e] rounded-lg shadow-lg py-2 z-10 border border-gray-700/30 max-w-[calc(100vw-2rem)]">
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
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : filteredAndSortedItems.length === 0 ? (
              <p>No items found</p>
            ) : (
              filteredAndSortedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2a2f3e] rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
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
                    {"tags" in item ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#1a1f2e] rounded-full text-sm text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#1a1f2e] rounded-full text-sm text-gray-300">
                          {item.style}
                        </span>
                        <span className="px-2 py-1 bg-[#1a1f2e] rounded-full text-sm text-gray-300">
                          {item.tone}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
