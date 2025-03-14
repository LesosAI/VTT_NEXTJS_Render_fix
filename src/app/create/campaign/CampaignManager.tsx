"use client";
import { useState, useEffect } from "react";
import { useLogin } from "@/context/LoginContext";

interface CampaignManagerProps {
  campaignId: number;
}

export default function CampaignManager({ campaignId }: CampaignManagerProps) {
  const { username } = useLogin();
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({
    description: "",
    genre: "fantasy",
    tone: "serious",
    setting: "medieval",
  });

  useEffect(() => {
    fetchContents();
  }, [campaignId]);

  const fetchContents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content`
      );
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            ...newContent,
          }),
        }
      );

      if (response.ok) {
        setNewContent({
          description: "",
          genre: "fantasy",
          tone: "serious",
          setting: "medieval",
        });
        fetchContents();
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div className="bg-[#2a2f3e] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Campaign Content</h2>

      {/* Content Generation Form */}
      <form onSubmit={handleGenerateContent} className="mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Genre Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">Genre</label>
            <select
              className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
              value={newContent.genre}
              onChange={(e) =>
                setNewContent({ ...newContent, genre: e.target.value })
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
          <div>
            <label className="block mb-2 text-sm font-medium">Tone</label>
            <select
              className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
              value={newContent.tone}
              onChange={(e) =>
                setNewContent({ ...newContent, tone: e.target.value })
              }
            >
              <option value="serious">Serious</option>
              <option value="lighthearted">Lighthearted</option>
              <option value="dark">Dark</option>
              <option value="comedic">Comedic</option>
            </select>
          </div>

          {/* Setting Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">Setting</label>
            <select
              className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
              value={newContent.setting}
              onChange={(e) =>
                setNewContent({ ...newContent, setting: e.target.value })
              }
            >
              <option value="medieval">Medieval</option>
              <option value="urban">Urban</option>
              <option value="wilderness">Wilderness</option>
              <option value="space">Space</option>
              <option value="underwater">Underwater</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Content Description
          </label>
          <textarea
            className="w-full p-3 bg-[#1a1f2e] rounded-lg text-sm"
            value={newContent.description}
            onChange={(e) =>
              setNewContent({ ...newContent, description: e.target.value })
            }
            placeholder="Describe what content you'd like to generate..."
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
        >
          Generate Content
        </button>
      </form>

      {/* Content List */}
      <div className="space-y-4">
        {contents.map((content) => (
          <div key={content.id} className="bg-[#1a1f2e] p-4 rounded-lg">
            <div className="flex gap-4 mb-3 text-xs text-gray-400">
              {content.genre && (
                <span className="px-2 py-1 bg-[#2a2f3e] rounded">
                  Genre: {content.genre}
                </span>
              )}
              {content.tone && (
                <span className="px-2 py-1 bg-[#2a2f3e] rounded">
                  Tone: {content.tone}
                </span>
              )}
              {content.setting && (
                <span className="px-2 py-1 bg-[#2a2f3e] rounded">
                  Setting: {content.setting}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{content.description}</p>
            <p className="whitespace-pre-wrap">{content.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              Created: {new Date(content.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
