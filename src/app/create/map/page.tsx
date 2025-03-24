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
  created_at: string;
};

export default function CreateMap() {
  const [mapData, setMapData] = useState({
    description: "",
    style: "fantasy",
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
      <div className="p-4 sm:p-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <h1 className="text-2xl font-bold mb-6 sm:mb-8">Create Map</h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 lg:gap-10"
          >
            {/* Left Column - Controls */}
            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-8">
              {/* Style Toggle */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Map Style
                </label>
                <div className="flex bg-[#2a2f3e] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setMapData({ ...mapData, style: "fantasy" })}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mapData.style === "fantasy"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Fantasy
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapData({ ...mapData, style: "sci-fi" })}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mapData.style === "sci-fi"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Sci-Fi
                  </button>
                </div>
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
            <div className="space-y-4 sm:space-y-6">
              {/* Description Input */}
              <div className="w-full">
                <label className="block mb-2 text-base font-medium">
                  Map Description
                </label>
                <textarea
                  className="w-full p-3 bg-[#2a2f3e] rounded-lg text-base min-h-[120px] sm:min-h-[150px]"
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
                  className={`w-full sm:w-auto py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
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
                <div className="mt-4 sm:mt-6 w-full">
                  <h2 className="text-xl font-bold mb-2 sm:mb-3">
                    Generated Preview
                  </h2>
                  <img
                    src={generatedImage}
                    alt="Generated map preview"
                    className="w-full rounded-lg border border-[#2a2f3e]"
                  />
                </div>
              )}
            </div>
          </form>

          {/* Map History Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl font-bold mb-4 sm:mb-6">
              Previously Generated Maps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mapHistory.map((map) => (
                <div
                  key={map.id}
                  className="bg-[#2a2f3e] rounded-lg overflow-hidden"
                >
                  <img
                    src={map.image_url}
                    alt="Generated map"
                    className="w-full h-36 sm:h-48 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      Style: {map.style}
                    </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
