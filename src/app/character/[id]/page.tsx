"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";

type Character = {
  id: number;
  image_url: string;
  description: string;
  style: string;
  gender: string;
  created_at: string;
  tags: string[];
};

export default function CharacterDetails() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const params = useParams();
  const router = useRouter();
  const { username } = useLogin();

  useEffect(() => {
    fetchCharacter();
  }, [params.id]);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character/${params.id}`
      );
      const data = await response.json();
      if (data.success) {
        setCharacter(data.character);
      }
    } catch (error) {
      console.error("Error fetching character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character/${params.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }), // For verification
        }
      );
      const data = await response.json();
      if (data.success) {
        router.push("/create/character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  const handleDownload = async () => {
    if (!character) return;
    try {
      const response = await fetch(character.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `character-${params.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleTokenDownload = async () => {
    if (!character) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character/${params.id}/token`,
        {
          method: "GET",
          headers: {
            Accept: "image/png",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download token");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `character-${params.id}-token.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading token:", error);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!character || !newTag.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character/${params.id}/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            tag: newTag.trim(),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCharacter({
          ...character,
          tags: [...character.tags, newTag.trim()],
        });
        setNewTag("");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!character) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/character/${
          params.id
        }/tags/${encodeURIComponent(tagToRemove)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }), // For verification
        }
      );

      const data = await response.json();
      if (data.success) {
        setCharacter({
          ...character,
          tags: character.tags.filter((tag) => tag !== tagToRemove),
        });
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">Character Details</h1>
          </div>

          <div className="bg-[#2a2f3e] rounded-lg overflow-hidden">
            <img
              src={character.image_url}
              alt="Character"
              className="w-full max-h-[600px] object-contain"
            />
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium">Tags</h3>
                  <form onSubmit={handleAddTag} className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 p-2 bg-[#1a1f2e] rounded-lg text-sm"
                      placeholder="Add a new tag..."
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Add Tag
                    </button>
                  </form>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {character.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg mb-2">
                    Style:{" "}
                    <span className="text-gray-300">{character.style}</span>
                  </p>
                  <p className="text-lg mb-4">
                    Gender:{" "}
                    <span className="text-gray-300">{character.gender}</span>
                  </p>
                  <p className="text-gray-400">{character.description}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Created: {new Date(character.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Download Image
                </button>
                <button
                  onClick={handleTokenDownload}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Download as Token
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete Character
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2f3e] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this character? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
