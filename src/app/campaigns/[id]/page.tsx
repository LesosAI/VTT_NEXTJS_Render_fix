"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Topbar from "@/components/Topbar";

interface Campaign {
  id: string;
  name: string;
  description: string;
}

interface ContentItem {
  type: string;
  id: number;
  name: string;
  description: string;
}

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setCampaign({
      id: String(id),
      name: "The Lost Kingdom",
      description: "A fantasy campaign...",
    });

    setContent([
      {
        type: "character",
        id: 1,
        name: "Hero",
        description: "A brave warrior",
      },
      { type: "map", id: 1, name: "Kingdom Map", description: "Overview map" },
      // Add more mock content
    ]);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <div className="p-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <h1 className="text-2xl font-bold mb-8">{campaign?.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-[#2a2f3e] p-4 rounded-lg"
              >
                <h3 className="font-bold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">Type: {item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
