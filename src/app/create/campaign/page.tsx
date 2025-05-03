"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import CampaignManager from "./CampaignManager";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";

export default function CreateCampaign() {
  const { username } = useLogin();
  const [campaigns, setCampaigns] = useState<
    Array<{ id: string; name: string; genre: string; tone: string; setting: string }>
  >([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [campaignData, setCampaignData] = useState({
    name: "",
    genre: "fantasy",
    tone: "serious",
    setting: "medieval",
  });

  const [generatedText, setGeneratedText] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchCampaigns();
    }
  }, [username]);

  // Add function to fetch content items

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (selectedCampaign) {
        // Update existing campaign
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${selectedCampaign}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...campaignData,
              username: username,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to update campaign");
        setGeneratedText("Campaign updated successfully!");
      } else {
        // Create new campaign
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...campaignData,
              username: username,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to create campaign");
        setGeneratedText("New campaign created successfully!");
      }

      // Refresh campaigns list
      const campaignsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${username}`
      );
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        const filteredCampaign = campaignsData.find(
          (c: { id: string }) => c.id === selectedCampaign
        );
        setCampaigns(campaignsData);
        setShowNewCampaignModal(false);
        setCampaignData(filteredCampaign
          ? {
            name: filteredCampaign.name,
            genre: filteredCampaign.genre,
            tone: filteredCampaign.tone,
            setting: filteredCampaign.setting,
          }
          : {
            name: "",
            genre: "fantasy",
            tone: "serious",
            setting: "medieval",
          }
        )
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneratedText("Error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update resetCampaignData
  const resetCampaignData = () => {
    setCampaignData({
      name: "",
      genre: "fantasy",
      tone: "serious",
      setting: "medieval",
    });
  };

  // Update handleCampaignSelect
  const handleCampaignSelect = (campaign: { id: string; name: string; genre: string; tone: string; setting: string }) => {
    setSelectedCampaign(campaign.id);
    setCampaignData({
      name: campaign.name,
      genre: campaign.genre,
      tone: campaign.tone,
      setting: campaign.setting,
    });
  };

  // Update the modal open handler to reset selection
  const handleNewCampaignModal = () => {
    setSelectedCampaign(null); // Reset selected campaign
    resetCampaignData(); // Reset form data
    setShowNewCampaignModal(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />

      <AnimatePresence>
        {isLoading && <ModernLoader />}
      </AnimatePresence>

      <div className="p-4 sm:p-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <h1 className="text-2xl font-bold mb-8">Campaign Manager</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-8">
            {/* Left Sidebar - Campaigns List */}
            <div className="space-y-4">
              {/* Navigation Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/create/map")}
                  className="w-full py-2.5 px-4 bg-[#2a2f3e] hover:bg-[#3a3f4e] rounded-lg text-sm font-medium transition-colors"
                >
                  Create Map
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/create/character")}
                  className="w-full py-2.5 px-4 bg-[#2a2f3e] hover:bg-[#3a3f4e] rounded-lg text-sm font-medium transition-colors"
                >
                  Create Character
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Your Campaigns</h2>
                <button
                  onClick={handleNewCampaignModal}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                  title="Create New Campaign"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 max-h-[200px] lg:max-h-none overflow-y-auto lg:overflow-visible">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`p-3 rounded-lg cursor-pointer ${selectedCampaign === campaign.id
                      ? "bg-blue-600"
                      : "bg-[#2a2f3e] hover:bg-[#3a3f4e]"
                      }`}
                    onClick={() => handleCampaignSelect(campaign)}
                  >
                    <h3 className="font-medium">{campaign.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Campaign Description Form */}
            <div className="mt-4 lg:mt-0">
              {selectedCampaign ? (
                <CampaignManager
                  campaignId={parseInt(selectedCampaign)}
                  campaignData={campaignData}
                  onCampaignDataChange={(updated: Partial<typeof campaignData>) => setCampaignData((prev) => ({ ...prev, ...updated }))}
                  onUpdate={handleSubmit}
                />
              ) : (
                <div className="bg-[#2a2f3e] rounded-lg p-4 sm:p-6 text-center">
                  <p className="text-gray-400">
                    Select a campaign or create a new one to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2f3e] rounded-lg p-4 sm:p-6 w-full max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block mb-2 text-sm font-medium">
                  Campaign Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                  value={campaignData.name}
                  onChange={(e) =>
                    setCampaignData({
                      ...campaignData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              {/* Genre Selection */}
              <div className="mb-2">
                <label className="block mb-2 text-sm font-medium">Genre</label>
                <select
                  className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                  value={campaignData.genre}
                  onChange={(e) =>
                    setCampaignData({ ...campaignData, genre: e.target.value })
                  }
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Science Fiction</option>
                  <option value="horror">Horror</option>
                  <option value="modern">Modern</option>
                  <option value="post-apocalyptic">Post-Apocalyptic</option>
                </select>
              </div>

              {/* Tone Selection */}
              <div className="mb-2">
                <label className="block mb-2 text-sm font-medium">Tone</label>
                <select
                  className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                  value={campaignData.tone}
                  onChange={(e) =>
                    setCampaignData({ ...campaignData, tone: e.target.value })
                  }
                >
                  <option value="serious">Serious</option>
                  <option value="lighthearted">Lighthearted</option>
                  <option value="dark">Dark</option>
                  <option value="comedic">Comedic</option>
                </select>
              </div>

              {/* Setting Selection */}
              <div className="mb-2">
                <label className="block mb-2 text-sm font-medium">Setting</label>
                <select
                  className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                  value={campaignData.setting}
                  onChange={(e) =>
                    setCampaignData({ ...campaignData, setting: e.target.value })
                  }
                >
                  <option value="medieval">Medieval</option>
                  <option value="urban">Urban</option>
                  <option value="wilderness">Wilderness</option>
                  <option value="space">Space</option>
                  <option value="underwater">Underwater</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
