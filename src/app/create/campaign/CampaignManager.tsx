"use client";
import { useState, useEffect, useRef } from "react";
import { useLogin } from "@/context/LoginContext";

interface CampaignManagerProps {
  campaignId: number;
}

interface Content {
  id: number;
  genre: string;
  tone: string;
  setting: string;
  description: string;
  content: string;
  content_category: string;
  created_at: string;
}

export default function CampaignManager({ campaignId }: CampaignManagerProps) {
  const { username } = useLogin();
  const [contents, setContents] = useState<Content[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newContent, setNewContent] = useState({
    description: "",
    content_category: "settings",
    genre: "fantasy",
    tone: "serious",
    setting: "medieval",
  });
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContents, setSelectedContents] = useState<Content[]>([]);
  const [chattingContentId, setChattingContentId] = useState<Number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const tabs: ('settings' | 'character' | 'story')[] = ['settings', 'character', 'story'];
  const [activeTab, setActiveTab] = useState<'settings' | 'character' | 'story'>('settings');



  const presetPrompts = [
    {
      label: "New Campaign",
      text: "Help me generate ideas and an outline for a new campaign, including potential story arcs and major plot points.",
    },
    {
      label: "NPC Ideas",
      text: "Generate interesting NPC ideas including their background, motivations, and potential role in the story.",
    },
    {
      label: "Campaign Details",
      text: "Help me add more detail and depth to my existing campaign, including side quests, locations, and world building elements.",
    },
  ];

  useEffect(() => {
    if (chattingContentId && chatInputRef.current) {
      // Small timeout ensures the element is rendered before scroll
      setTimeout(() => {
        chatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [chattingContentId]);


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
    setIsGenerating(true);

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
            selectedContentIds: selectedContents.map((content) => content.id),
          }),
        }
      );

      if (response.ok) {
        setNewContent({
          description: "",
          content_category: "settings",
          genre: "fantasy",
          tone: "serious",
          setting: "medieval",
        });
        setSelectedContents([]);
        fetchContents();
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (response.ok) {
        fetchContents();
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleEditContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${editingContent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            ...editingContent,
          }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        setEditingContent(null);
        fetchContents();
      }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const startEditing = (content: Content) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingContent(null);
    setIsEditing(false);
  };

  const handlePresetPrompt = (promptText: string) => {
    setNewContent({
      ...newContent,
      description: promptText,
    });
  };

  const handleRemoveSelectedContent = (contentToRemove: Content) => {
    setSelectedContents(
      selectedContents.filter((c) => c.id !== contentToRemove.id)
    );
    setNewContent({
      ...newContent,
      description: newContent.description.replace(
        `Reference to previous content: ${contentToRemove.description}\n`,
        ""
      ),
    });
  };

  const handleSendChat = async (contentId: number) => {
    if (!chatInput.trim()) return;

    // Example API call or logic
    console.log(`Sending to AI: ${chatInput} for content #${contentId}`);

    // Clear input
    setChatInput('');
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

          {/* Previous Content Selection */}
          <div className="col-span-3">
            <label className="block mb-2 text-sm font-medium">
              Campaign Context
            </label>
            <select
              className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
              value=""
              onChange={(e) => {
                const content = contents.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                if (
                  content &&
                  !selectedContents.some((sc) => sc.id === content.id)
                ) {
                  setSelectedContents([...selectedContents, content]);
                }
              }}
            >
              <option value="">Select previous content to reference...</option>
              {contents
                .filter(
                  (content) =>
                    !selectedContents.some((sc) => sc.id === content.id)
                )
                .map((content) => (
                  <option key={content.id} value={content.id}>
                    {content.description.substring(0, 100)}...
                  </option>
                ))}
            </select>

            {/* Selected Content Tags */}
            {selectedContents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedContents.map((content) => (
                  <span
                    key={content.id}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#1a1f2e] hover:bg-[#3a3f4e] rounded-full text-gray-300"
                  >
                    {content.description.substring(0, 50)}...
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContents(
                          selectedContents.filter((c) => c.id !== content.id)
                        );
                      }}
                      className="ml-2 text-gray-400 hover:text-red-400"
                      title="Remove reference"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Choose Category</label>
          <select
            className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
            value={newContent.content_category}
            onChange={(e) =>
              setNewContent({ ...newContent, content_category: e.target.value })
            }
          >
            <option value="Settings">Settings</option>
            <option value="Character">Character</option>
            <option value="Story">Story</option>
          </select>
        </div>

        <div className=" mt-2 mb-4">
          <label className="block mb-2 text-sm font-medium">
            Content Description
          </label>
          <div className="flex gap-2 mb-2">
            {presetPrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetPrompt(prompt.text)}
                className="px-3 py-1 text-xs bg-[#1a1f2e] hover:bg-[#3a3f4e] rounded-full text-gray-300"
              >
                {prompt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setNewContent({ ...newContent, description: "" })}
              className="px-3 py-1 text-xs bg-red-900 hover:bg-red-800 rounded-full text-gray-300"
              title="Clear description"
            >
              Clear
            </button>
          </div>
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
          disabled={!newContent.description.trim() || isGenerating}
          className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 ${!newContent.description.trim() || isGenerating
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
            "Generate Content"
          )}
        </button>
      </form>

      {/* Content List */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`w-full text-center p-2 rounded-lg cursor-pointer transition-colors font-medium
              ${activeTab === tab
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-[#3a3f4e] hover:bg-[#4a4f5e] text-gray-300'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {contents
          .filter(
            (content) =>
              content.content_category?.toLowerCase().trim() ===
              activeTab?.toLowerCase().trim()
          )
          .map((content) => (
            <div key={content.id} className="bg-[#1a1f2e] p-4 rounded-lg">
              {isEditing && editingContent?.id === content.id ? (
                <form onSubmit={handleEditContent} className="space-y-4">
                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
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
                  <p className="text-sm text-gray-400 mb-2">
                    {content.description}
                  </p>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Content
                    </label>
                    <textarea
                      className="w-full p-3 bg-[#2a2f3e] rounded-lg text-sm"
                      value={editingContent.content}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          content: e.target.value,
                        })
                      }
                      rows={8}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-4 text-xs text-gray-400">
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChattingContentId(content.id)}
                        className="p-1 text-gray-400 hover:text-green-400"
                        title="Chat"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h6m5 8l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
                          />
                        </svg>

                      </button>

                      <button
                        onClick={() => startEditing(content)}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {content.description}
                  </p>
                  <p className="whitespace-pre-wrap">{content.content}</p>
                  {chattingContentId === content.id && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-400">
                        Chat with AI about this section
                      </label>
                      <div className="flex gap-2">
                        <input
                          ref={chatInputRef}
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-grow p-2 rounded bg-[#2a2f3e] text-sm"
                          placeholder="Ask AI about this content..."
                        />

                        <button
                          onClick={() => handleSendChat(content.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(content.created_at).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import { useLogin } from "@/context/LoginContext";

// interface CampaignManagerProps {
//   campaignId: number;
// }

// interface Content {
//   id: number;
//   genre: string;
//   tone: string;
//   setting: string;
//   description: string;
//   content: string;
//   content_setting: string;
//   content_characters: string;
//   content_story: string;
//   created_at: string;
// }

// export default function CampaignManager({ campaignId }: CampaignManagerProps) {
//   const { username } = useLogin();
//   const [contents, setContents] = useState<Content[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [newContent, setNewContent] = useState({
//     description: "",
//     genre: "fantasy",
//     tone: "serious",
//     setting: "medieval",
//   });
//   const [editingContent, setEditingContent] = useState<Content | null>(null);
//   const [editingSection, setEditingSection] = useState<{
//     contentId: number;
//     section: "setting" | "characters" | "story";
//     mode: "edit" | "regenerate";
//   } | null>(null);

//   const [sectionPromptText, setSectionPromptText] = useState<string>("");

//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedContents, setSelectedContents] = useState<Content[]>([]);

//   const presetPrompts = [
//     {
//       label: "New Campaign",
//       text: "Help me generate ideas and an outline for a new campaign, including potential story arcs and major plot points.",
//     },
//     {
//       label: "NPC Ideas",
//       text: "Generate interesting NPC ideas including their background, motivations, and potential role in the story.",
//     },
//     {
//       label: "Campaign Details",
//       text: "Help me add more detail and depth to my existing campaign, including side quests, locations, and world building elements.",
//     },
//   ];

//   useEffect(() => {
//     fetchContents();
//   }, [campaignId]);

//   const fetchContents = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setContents(data);
//       }
//     } catch (error) {
//       console.error("Error fetching contents:", error);
//     }
//   };

//   const handleGenerateContent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsGenerating(true);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/generate`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username,
//             ...newContent,
//             selectedContentIds: selectedContents.map((content) => content.id),
//           }),
//         }
//       );

//       if (response.ok) {
//         setNewContent({
//           description: "",
//           genre: "fantasy",
//           tone: "serious",
//           setting: "medieval",
//         });
//         setSelectedContents([]);
//         fetchContents();
//       }
//     } catch (error) {
//       console.error("Error generating content:", error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDeleteContent = async (contentId: number) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ username }),
//         }
//       );

//       if (response.ok) {
//         fetchContents();
//       }
//     } catch (error) {
//       console.error("Error deleting content:", error);
//     }
//   };

//   const handleEditContent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingContent) return;

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${editingContent.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username,
//             ...editingContent,
//           }),
//         }
//       );

//       if (response.ok) {
//         setIsEditing(false);
//         setEditingContent(null);
//         fetchContents();
//       }
//     } catch (error) {
//       console.error("Error updating content:", error);
//     }
//   };

//   const startEditing = (content: Content) => {
//     setEditingContent(content);
//     setIsEditing(true);
//   };

//   const cancelEditing = () => {
//     setEditingContent(null);
//     setIsEditing(false);
//   };

//   const handlePresetPrompt = (promptText: string) => {
//     setNewContent({
//       ...newContent,
//       description: promptText,
//     });
//   };

//   const handleRemoveSelectedContent = (contentToRemove: Content) => {
//     setSelectedContents(
//       selectedContents.filter((c) => c.id !== contentToRemove.id)
//     );
//     setNewContent({
//       ...newContent,
//       description: newContent.description.replace(
//         `Reference to previous content: ${contentToRemove.description}\n`,
//         ""
//       ),
//     });
//   };

//   const handleSaveSectionEdit = async (
//     contentId: number,
//     section: "setting" | "characters" | "story"
//   ) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}/edit`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             section,
//             newText: sectionPromptText,
//           }),
//         }
//       );

//       if (response.ok) {
//         setEditingSection(null);
//         fetchContents();
//       }
//     } catch (error) {
//       console.error("Error saving section edit:", error);
//     }
//   };


//   const handleRegenerateSection = async (
//     contentId: number,
//     section: "setting" | "characters" | "story"
//   ) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}/regenerate`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             section,
//             prompt: sectionPromptText, // user’s prompt to AI
//           }),
//         }
//       );

//       if (response.ok) {
//         setEditingSection(null);
//         fetchContents();
//       }
//     } catch (error) {
//       console.error("Error regenerating section:", error);
//     }
//   };

//   return (
//     <div className="bg-[#2a2f3e] rounded-lg p-6">
//       <h2 className="text-xl font-bold mb-6">Campaign Content</h2>

//       {/* Content Generation Form */}
//       <form onSubmit={handleGenerateContent} className="mb-8">
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           {/* Genre Selection */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">Genre</label>
//             <select
//               className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
//               value={newContent.genre}
//               onChange={(e) =>
//                 setNewContent({ ...newContent, genre: e.target.value })
//               }
//             >
//               <option value="fantasy">Fantasy</option>
//               <option value="sci-fi">Science Fiction</option>
//               <option value="horror">Horror</option>
//               <option value="modern">Modern</option>
//               <option value="post-apocalyptic">Post-Apocalyptic</option>
//             </select>
//           </div>

//           {/* Tone Selection */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">Tone</label>
//             <select
//               className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
//               value={newContent.tone}
//               onChange={(e) =>
//                 setNewContent({ ...newContent, tone: e.target.value })
//               }
//             >
//               <option value="serious">Serious</option>
//               <option value="lighthearted">Lighthearted</option>
//               <option value="dark">Dark</option>
//               <option value="comedic">Comedic</option>
//             </select>
//           </div>

//           {/* Setting Selection */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">Setting</label>
//             <select
//               className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
//               value={newContent.setting}
//               onChange={(e) =>
//                 setNewContent({ ...newContent, setting: e.target.value })
//               }
//             >
//               <option value="medieval">Medieval</option>
//               <option value="urban">Urban</option>
//               <option value="wilderness">Wilderness</option>
//               <option value="space">Space</option>
//               <option value="underwater">Underwater</option>
//             </select>
//           </div>

//           {/* Previous Content Selection */}
//           <div className="col-span-3">
//             <label className="block mb-2 text-sm font-medium">
//               Campaign Context
//             </label>
//             <select
//               className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
//               value=""
//               onChange={(e) => {
//                 const content = contents.find(
//                   (c) => c.id === parseInt(e.target.value)
//                 );
//                 if (
//                   content &&
//                   !selectedContents.some((sc) => sc.id === content.id)
//                 ) {
//                   setSelectedContents([...selectedContents, content]);
//                 }
//               }}
//             >
//               <option value="">Select previous content to reference...</option>
//               {contents
//                 .filter(
//                   (content) =>
//                     !selectedContents.some((sc) => sc.id === content.id)
//                 )
//                 .map((content) => (
//                   <option key={content.id} value={content.id}>
//                     {content.description.substring(0, 100)}...
//                   </option>
//                 ))}
//             </select>

//             {/* Selected Content Tags */}
//             {selectedContents.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {selectedContents.map((content) => (
//                   <span
//                     key={content.id}
//                     className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#1a1f2e] hover:bg-[#3a3f4e] rounded-full text-gray-300"
//                   >
//                     {content.description.substring(0, 50)}...
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedContents(
//                           selectedContents.filter((c) => c.id !== content.id)
//                         );
//                       }}
//                       className="ml-2 text-gray-400 hover:text-red-400"
//                       title="Remove reference"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium">
//             Content Description
//           </label>
//           <div className="flex gap-2 mb-2">
//             {presetPrompts.map((prompt, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => handlePresetPrompt(prompt.text)}
//                 className="px-3 py-1 text-xs bg-[#1a1f2e] hover:bg-[#3a3f4e] rounded-full text-gray-300"
//               >
//                 {prompt.label}
//               </button>
//             ))}
//             <button
//               type="button"
//               onClick={() => setNewContent({ ...newContent, description: "" })}
//               className="px-3 py-1 text-xs bg-red-900 hover:bg-red-800 rounded-full text-gray-300"
//               title="Clear description"
//             >
//               Clear
//             </button>
//           </div>
//           <textarea
//             className="w-full p-3 bg-[#1a1f2e] rounded-lg text-sm"
//             value={newContent.description}
//             onChange={(e) =>
//               setNewContent({ ...newContent, description: e.target.value })
//             }
//             placeholder="Describe what content you'd like to generate..."
//             rows={4}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={!newContent.description.trim() || isGenerating}
//           className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 ${!newContent.description.trim() || isGenerating
//             ? "bg-gray-600 cursor-not-allowed opacity-50"
//             : "bg-blue-600 hover:bg-blue-700"
//             }`}
//         >
//           {isGenerating ? (
//             <>
//               <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 />
//               </svg>
//               Working...
//             </>
//           ) : (
//             "Generate Content"
//           )}
//         </button>
//       </form>

//       {/* Content List */}
//       <div className="space-y-4">
//         {contents.map((content) => (
//           <div key={content.id} className="bg-[#1a1f2e] p-4 rounded-lg">
//             {isEditing && editingContent?.id === content.id ? (
//               <form onSubmit={handleEditContent} className="space-y-4">
//                 <div className="flex gap-4 text-xs text-gray-400 mb-3">
//                   {content.genre && (
//                     <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                       Genre: {content.genre}
//                     </span>
//                   )}
//                   {content.tone && (
//                     <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                       Tone: {content.tone}
//                     </span>
//                   )}
//                   {content.setting && (
//                     <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                       Setting: {content.setting}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-400 mb-2">
//                   {content.description}
//                 </p>

//                 <div>
//                   <label className="block mb-2 text-sm font-medium">
//                     Content
//                   </label>
//                   <textarea
//                     className="w-full p-3 bg-[#2a2f3e] rounded-lg text-sm"
//                     value={editingContent.content}
//                     onChange={(e) =>
//                       setEditingContent({
//                         ...editingContent,
//                         content: e.target.value,
//                       })
//                     }
//                     rows={8}
//                     required
//                   />
//                 </div>

//                 <div className="flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={cancelEditing}
//                     className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <>
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex gap-4 text-xs text-gray-400">
//                     {content.genre && (
//                       <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                         Genre: {content.genre}
//                       </span>
//                     )}
//                     {content.tone && (
//                       <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                         Tone: {content.tone}
//                       </span>
//                     )}
//                     {content.setting && (
//                       <span className="px-2 py-1 bg-[#2a2f3e] rounded">
//                         Setting: {content.setting}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleDeleteContent(content.id)}
//                       className="p-1 text-gray-400 hover:text-red-400"
//                       title="Delete"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-400 mb-2">
//                   {content.description}
//                 </p>
//                 <div className="flex justify-between items-start my-3">
//                   <div className="flex gap-4 text-xl text-gray-300">
//                     Settings:
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "setting", mode: "edit" });
//                         setSectionPromptText(content.content_setting || "");
//                       }}
//                       className="p-1 text-gray-400 hover:text-white"
//                       title="Edit"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "setting", mode: "regenerate" });
//                         setSectionPromptText("");
//                       }}
//                       className="text-xs px-2 py-1 bg-[#2a2f3e] rounded text-blue-400"
//                     >
//                       Regenerate
//                     </button>
//                   </div>
//                 </div>

//                 {editingSection?.contentId === content.id && editingSection.section === "setting" ? (
//                   <div className="mb-4">
//                     <textarea
//                       className="w-full p-3 bg-[#2a2f3e] rounded-lg text-sm"
//                       value={sectionPromptText}
//                       onChange={(e) => setSectionPromptText(e.target.value)}
//                       placeholder={
//                         editingSection.mode === "edit"
//                           ? "Edit this section directly..."
//                           : "Enter prompt to regenerate this section (e.g., make it more dark and mysterious)..."
//                       }
//                       rows={8}
//                     />
//                     <div className="flex justify-end gap-2 mt-2">
//                       {editingSection.mode === "edit" ? (
//                         <button
//                           onClick={() => handleSaveSectionEdit(content.id, "setting")}
//                           className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                         >
//                           Save Changes
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleRegenerateSection(content.id, "setting")}
//                           className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                         >
//                           Regenerate
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setEditingSection(null)}
//                         className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="whitespace-pre-wrap">{content.content_setting}</p>
//                 )}

//                 <div className="flex justify-between items-start my-3">
//                   <div className="flex gap-4 text-xl text-gray-300">
//                     Characters:
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "characters", mode: "edit" });
//                         setSectionPromptText(content.content_characters || "");
//                       }}
//                       className="p-1 text-gray-400 hover:text-white"
//                       title="Edit"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "characters", mode: "regenerate" });
//                         setSectionPromptText("");
//                       }}
//                       className="text-xs px-2 py-1 bg-[#2a2f3e] rounded text-blue-400"
//                     >
//                       Regenerate
//                     </button>
//                   </div>
//                 </div>

//                 {editingSection?.contentId === content.id && editingSection.section === "characters" ? (
//                   <div className="mb-4">
//                     <textarea
//                       className="w-full p-3 bg-[#2a2f3e] rounded-lg text-sm"
//                       value={sectionPromptText}
//                       onChange={(e) => setSectionPromptText(e.target.value)}
//                       placeholder={
//                         editingSection.mode === "edit"
//                           ? "Edit this section directly..."
//                           : "Enter prompt to regenerate this section (e.g., make it more dark and mysterious)..."
//                       }
//                       rows={8}
//                     />
//                     <div className="flex justify-end gap-2 mt-2">
//                       {editingSection.mode === "edit" ? (
//                         <button
//                           onClick={() => handleSaveSectionEdit(content.id, "characters")}
//                           className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                         >
//                           Save Changes
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleRegenerateSection(content.id, "characters")}
//                           className="px-2 py-1 bg-blue-600 text-white rounded"
//                         >
//                           Regenerate
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setEditingSection(null)}
//                         className="px-2 py-1 bg-gray-500 text-white rounded"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="whitespace-pre-wrap">{content.content_characters}</p>
//                 )}
//                 <div className="flex justify-between items-start my-3">
//                   <div className="flex gap-4 text-xl text-gray-300">
//                     Story:
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "story", mode: "edit" });
//                         setSectionPromptText(content.content_story || "");
//                       }}
//                       className="p-1 text-gray-400 hover:text-white"
//                       title="Edit"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => {
//                         setEditingSection({ contentId: content.id, section: "story", mode: "regenerate" });
//                         setSectionPromptText("");
//                       }}
//                       className="text-xs px-2 py-1 bg-[#2a2f3e] rounded text-blue-400"
//                     >
//                       Regenerate
//                     </button>
//                   </div>
//                 </div>

//                 {editingSection?.contentId === content.id && editingSection.section === "story" ? (
//                   <div className="mb-4">
//                     <textarea
//                       className="w-full p-3 bg-[#2a2f3e] rounded-lg text-sm"
//                       value={sectionPromptText}
//                       onChange={(e) => setSectionPromptText(e.target.value)}
//                       placeholder={
//                         editingSection.mode === "edit"
//                           ? "Edit this section directly..."
//                           : "Enter prompt to regenerate this section (e.g., make it more dark and mysterious)..."
//                       }
//                       rows={8}
//                     />
//                     <div className="flex justify-end gap-2 mt-2">
//                       {editingSection.mode === "edit" ? (
//                         <button
//                           onClick={() => handleSaveSectionEdit(content.id, "story")}
//                           className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                         >
//                           Save Changes
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleRegenerateSection(content.id, "story")}
//                           className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
//                         >
//                           Regenerate
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setEditingSection(null)}
//                         className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="whitespace-pre-wrap">{content.content_story}</p>
//                 )}
//                 <p className="text-xs text-gray-500 mt-2">
//                   Created: {new Date(content.created_at).toLocaleString()}
//                 </p>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
