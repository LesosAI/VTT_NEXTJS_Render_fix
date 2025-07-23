"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";
import { WalkthroughProvider } from "@/components/WalkthroughProvider";
import { WalkthroughSteps, characterWalkthroughSteps } from "@/components/WalkthroughSteps";
import { WalkthroughButton } from "@/components/WalkthroughButton";

type Character = {
  id: number;
  image_url: string;
  description: string;
  style: string;
  created_at: string;
  tags: string[];
};

export default function CreateCharacter() {
  const [characterData, setCharacterData] = useState({
    description: "",
    style: "fantasy",
    imageShape: 50,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedImage, setGeneratedImage] = useState("");
  const [characterHistory, setCharacterHistory] = useState<Character[]>([]);

  const { username } = useLogin();
  const router = useRouter();

  const fetchCharacterHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character-history/${username}`
      );
      const data = await response.json();
      if (data.success) {
        setCharacterHistory(data.characters);
      }
    } catch (error) {
      console.error("Error fetching character history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchCharacterHistory();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          description: characterData.description,
          style: characterData.style,
        }),
      });

      const { task_id } = await res.json();

      const checkStatus = async () => {
        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/generation-status/${task_id}`
        );
        const data = await statusRes.json();

        if (data.status === "completed") {
          setGeneratedImage(data.result.image_url);
          fetchCharacterHistory();
          setIsGenerating(false);

          // Delete task after processing
          if (data.should_delete) {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/generation-status/${task_id}`,
              { method: "DELETE" }
            );
          }

        } else if (data.status === "failed") {
          console.error("Image generation failed:", data.error);
          setIsGenerating(false);

          // Also clean up failed task
          if (data.should_delete) {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/generation-status/${task_id}`,
              { method: "DELETE" }
            );
          }
        } else {
          setTimeout(checkStatus, 3000);
        }
      };

      checkStatus();

    } catch (err) {
      console.error("Error initiating image generation:", err);
      setIsGenerating(false);
    }
  };


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsGenerating(true);

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-image`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           username,
  //           description: characterData.description,
  //           style: characterData.style,
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       setGeneratedImage(data.image_url);
  //       fetchCharacterHistory();
  //     } else {
  //       console.error("Failed to generate image:", data.error);
  //       // You might want to show an error message to the user
  //     }
  //   } catch (error) {
  //     console.error("Error generating image:", error);
  //     // You might want to show an error message to the user
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  return (
    <WalkthroughProvider walkthroughKey="character-creation">
      <div className="min-h-screen bg-[#1a1f2e] text-white">
        <Topbar />

        <AnimatePresence>
          {isLoading && <ModernLoader />}
        </AnimatePresence>

        <div className="p-8">
          <div className="w-full max-w-[1800px] mx-auto">
            {/* Welcome message for walkthrough */}
            <div className="character-walkthrough-welcome mb-8 relative z-10">
              <h1 className="text-2xl font-bold mb-2">Create Character</h1>
              <p className="text-gray-400">Generate unique character portraits for your tabletop RPG campaigns</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 lg:gap-10"
            >
              {/* Left Column - Controls */}
              <div className="space-y-6 lg:sticky lg:top-8">
                {/* Navigation Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/create/campaign")}
                    className="w-full py-2.5 px-4 bg-[#2a2f3e] hover:bg-[#3a3f4e] rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/create/map")}
                    className="w-full py-2.5 px-4 bg-[#2a2f3e] hover:bg-[#3a3f4e] rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Map
                  </button>
                </div>

                {/* Style Selection */}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium">
                    Character Style
                  </label>
                  <div className="flex bg-[#2a2f3e] rounded-lg p-1 character-style-buttons">
                    <button
                      type="button"
                      onClick={() =>
                        setCharacterData({ ...characterData, style: "fantasy" })
                      }
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${characterData.style === "fantasy"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                        }`}
                    >
                      Fantasy
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCharacterData({ ...characterData, style: "sci-fi" })
                      }
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${characterData.style === "sci-fi"
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
                    Image Resolution
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={characterData.imageShape}
                    onChange={(e) =>
                      setCharacterData({
                        ...characterData,
                        imageShape: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-[#2a2f3e] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-400 mt-1.5">
                    {characterData.imageShape < 33
                      ? "512×512"
                      : characterData.imageShape < 66
                        ? "768×768"
                        : "1024×1024"}
                  </div>
                </div>
              </div>

              {/* Right Column - Description and Preview */}
              <div className="space-y-6">
                {/* Description Input */}
                <div className="w-full">
                  <label className="block mb-2 text-base font-medium">
                    Character Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-[#2a2f3e] rounded-lg text-base min-h-[150px]"
                    value={characterData.description}
                    onChange={(e) =>
                      setCharacterData({
                        ...characterData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your character (e.g., A tall warrior with long silver hair, wearing ornate armor...)"
                  />
                </div>

                {/* Generate Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!characterData.description.trim() || isGenerating}
                    className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 ${!characterData.description.trim() || isGenerating
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
                      "Generate Character"
                    )}
                  </button>
                </div>

                {/* Preview Area */}
                {generatedImage && (
                  <div className="mt-6 w-full">
                    <h2 className="text-xl font-bold mb-3">Generated Preview</h2>
                    <img
                      src={generatedImage}
                      alt="Generated character preview"
                      className="w-full rounded-lg border border-[#2a2f3e]"
                    />
                  </div>
                )}
              </div>
            </form>

            {/* Add Character History Section */}
            <div className="mt-8 lg:mt-12">
              <h2 className="text-xl font-bold mb-4 lg:mb-6">
                Previously Generated Characters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 character-history">
                {characterHistory.map((character) => (
                  <div
                    key={character.id}
                    className="bg-[#2a2f3e] rounded-lg overflow-hidden cursor-pointer hover:bg-[#3a3f4e] transition-colors"
                    onClick={() => router.push(`/character/${character.id}`)}
                  >
                    <img
                      src={character.image_url}
                      alt="Generated character"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-300 mb-2">
                        Style: {character.style}
                      </p>
                      <p className="text-sm text-gray-400">
                        {character.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(character.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Walkthrough Button - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <WalkthroughButton variant="icon" />
        </div>

        {/* Walkthrough Steps */}
        <WalkthroughSteps steps={characterWalkthroughSteps} />

        {/* Completion element for walkthrough */}
        <div className="character-walkthrough-complete" style={{ display: 'none' }}></div>
      </div>
    </WalkthroughProvider>
  );
}
