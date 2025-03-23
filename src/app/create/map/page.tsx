"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";

type Map = {
  id: number;
  image_url: string;
  description: string;
  style: string;
  tone: string;
  created_at: string;
};

export default function CreateMap() {
  const [mapData, setMapData] = useState({
    description: "",
    style: "fantasy",
    tone: "realistic",
    imageShape: 50,
  });

  const [generatedImage, setGeneratedImage] = useState("");
  const { username } = useLogin();
  const [mapHistory, setMapHistory] = useState<Map[]>([]);
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchMapHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/map-history/${username}`
      );
      const data = await response.json();
      if (data.success) {
        setMapHistory(data.maps);
      }
    } catch (error) {
      console.error("Error fetching map history:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchMapHistory();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-map`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            description: mapData.description,
            style: mapData.style,
            tone: mapData.tone,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.image_url);
        fetchMapHistory();
      } else {
        console.error("Failed to generate map:", data.error);
      }
    } catch (error) {
      console.error("Error generating map:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <div className="p-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <h1 className="text-2xl font-bold mb-8">Create Map</h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-[350px_1fr] gap-10"
          >
            {/* Left Column - Controls */}
            <div className="space-y-6 sticky top-8">
              {/* Style Selection */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Map Style
                </label>
                <select
                  className="w-full p-2 bg-[#2a2f3e] rounded-lg text-sm"
                  value={mapData.style}
                  onChange={(e) =>
                    setMapData({ ...mapData, style: e.target.value })
                  }
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="realistic">Realistic</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>

              {/* Tone Selection */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Map Tone
                </label>
                <select
                  className="w-full p-2 bg-[#2a2f3e] rounded-lg text-sm"
                  value={mapData.tone}
                  onChange={(e) =>
                    setMapData({ ...mapData, tone: e.target.value })
                  }
                >
                  <option value="realistic">Realistic</option>
                  <option value="stylized">Stylized</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              {/* Image Shape Slider */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Image Shape (Square to Rectangle)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mapData.imageShape}
                  onChange={(e) =>
                    setMapData({
                      ...mapData,
                      imageShape: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-[#2a2f3e] rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-400 mt-1.5">
                  {mapData.imageShape < 50 ? "More Square" : "More Rectangle"}
                </div>
              </div>
            </div>

            {/* Right Column - Description and Preview */}
            <div className="space-y-6">
              {/* Description Input */}
              <div className="w-full">
                <label className="block mb-2 text-base font-medium">
                  Map Description
                </label>
                <textarea
                  className="w-full p-3 bg-[#2a2f3e] rounded-lg text-base min-h-[150px]"
                  value={mapData.description}
                  onChange={(e) =>
                    setMapData({ ...mapData, description: e.target.value })
                  }
                  placeholder="Describe your map (e.g., A medieval fantasy kingdom with mountains in the north...)"
                />
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!mapData.description.trim() || isGenerating}
                  className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 ${
                    !mapData.description.trim() || isGenerating
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Working...
                    </>
                  ) : (
                    "Generate Map"
                  )}
                </button>
              </div>

              {/* Preview Area */}
              {generatedImage && (
                <div className="mt-6 w-full">
                  <h2 className="text-xl font-bold mb-3">Generated Preview</h2>
                  <img
                    src={generatedImage}
                    alt="Generated map preview"
                    className="w-full rounded-lg border border-[#2a2f3e]"
                  />
                </div>
              )}
            </div>
          </form>

          {/* Add Map History Section after the form */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">
              Previously Generated Maps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mapHistory.map((map) => (
                <div
                  key={map.id}
                  className="bg-[#2a2f3e] rounded-lg overflow-hidden cursor-pointer hover:bg-[#3a3f4e] transition-colors"
                  onClick={() => router.push(`/map/${map.id}`)}
                >
                  <img
                    src={map.image_url}
                    alt="Generated map"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      Style: {map.style} | Tone: {map.tone}
                    </p>
                    <p className="text-sm text-gray-400">{map.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(map.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
