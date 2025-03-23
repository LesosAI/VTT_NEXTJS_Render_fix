"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";

type Character = {
  id: number;
  image_url: string;
  description: string;
  style: string;
  gender: string;
  created_at: string;
  tags: string[];
};

export default function CreateCharacter() {
  const [characterData, setCharacterData] = useState({
    description: "",
    style: "realistic",
    gender: "neutral",
    imageShape: 50,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
    }
  };

  useEffect(() => {
    if (username) {
      fetchCharacterHistory();
    }
  }, [username]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !characterData.tags.includes(newTag.trim())) {
      setCharacterData({
        ...characterData,
        tags: [...characterData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCharacterData({
      ...characterData,
      tags: characterData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            description: characterData.description,
            style: characterData.style,
            gender: characterData.gender,
            tags: characterData.tags,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.image_url);
        fetchCharacterHistory();
      } else {
        console.error("Failed to generate image:", data.error);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Error generating image:", error);
      // You might want to show an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <div className="p-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <h1 className="text-2xl font-bold mb-8">Create Character</h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 lg:gap-10"
          >
            {/* Left Column - Controls */}
            <div className="space-y-6 lg:sticky lg:top-8">
              {/* Style Selection */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Character Style
                </label>
                <select
                  className="w-full p-2 bg-[#2a2f3e] rounded-lg text-sm"
                  value={characterData.style}
                  onChange={(e) =>
                    setCharacterData({
                      ...characterData,
                      style: e.target.value,
                    })
                  }
                >
                  <option value="realistic">Realistic</option>
                  <option value="anime">Anime</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="stylized">Stylized</option>
                </select>
              </div>

              {/* Gender Selection */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Character Gender
                </label>
                <select
                  className="w-full p-2 bg-[#2a2f3e] rounded-lg text-sm"
                  value={characterData.gender}
                  onChange={(e) =>
                    setCharacterData({
                      ...characterData,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="neutral">Neutral</option>
                  <option value="masculine">Masculine</option>
                  <option value="feminine">Feminine</option>
                </select>
              </div>

              {/* Image Shape Slider */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">
                  Image Shape (Portrait to Full Body)
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
                  {characterData.imageShape < 50 ? "Portrait" : "Full Body"}
                </div>
              </div>

              {/* Add Tags Section */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium">Tags</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {characterData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveTag(tag);
                        }}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 p-2 bg-[#2a2f3e] rounded-lg text-sm"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </form>
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
                  className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 ${
                    !characterData.description.trim() || isGenerating
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
                      Style: {character.style} | Gender: {character.gender}
                    </p>
                    <p className="text-sm text-gray-400">
                      {character.description}
                    </p>
                    {character.tags && character.tags.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {character.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
    </div>
  );
}
