"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import { useLogin } from "@/context/LoginContext";
import { on } from "events";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";

interface CampaignData {
  name: string;
  genre: string;
  tone: string;
  setting: string;
}

interface CampaignManagerProps {
  campaignId: number;
  campaignData: CampaignData;
  onCampaignDataChange: (updated: Partial<CampaignData>) => void;
  onUpdate: (e: React.FormEvent) => void;
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

type Message = {
  role: 'user' | 'assistant';
  content: string;
};


interface ContentHistory {
  id: number;
  content_id: number;
  message: Message[];
  content_category: string;
  genre: string;
  tone: string;
  setting: string;
  created_at: string;
}

export default function CampaignManager({ campaignId, campaignData, onCampaignDataChange, onUpdate }: CampaignManagerProps) {
  const { username } = useLogin();
  const [contents, setContents] = useState<Content[]>([]);
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newContent, setNewContent] = useState({
    description: "",
    content_category: "world building",
  });
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContents, setSelectedContents] = useState<(Content | null)[]>([null, null, null]);
  const [chattingContentId, setChattingContentId] = useState<Number | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const promptInputRef = useRef<HTMLTextAreaElement | null>(null);
  const tabs: ('world building' | 'character' | 'story')[] = ['world building', 'character', 'story'];
  const [activeTab, setActiveTab] = useState<'world building' | 'character' | 'story'>('world building');
  const [regeneratingContentId, setRegeneratingContentId] = useState<number | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const categoryMap = ["world building", "character", "story"];
  const [showHistory, setShowHistory] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const promptBoxRef = useRef<HTMLDivElement>(null);
  const allowedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);




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
    if (chattingContentId && promptInputRef.current) {
      // Small timeout ensures the element is rendered before scroll
      setTimeout(() => {
        promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        promptInputRef.current?.focus();
      }, 100);
    }
  }, [chattingContentId]);


  useEffect(() => {
    fetchContents();
  }, [campaignId]);

  useEffect(() => {
    if (showHistory) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showHistory]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selected = selection.toString().trim();
      if (selected.length === 0) return;

      const container = allowedRef.current;
      if (!container || !container.contains(range.commonAncestorContainer)) {
        // Selection was outside the allowed area
        return;
      }

      // Selection is inside the allowed area
      setSelectionRange(range);
      setSelectedText(selected);

      const rect = range.getBoundingClientRect();
      setToolbarPos({
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX,
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);


  useEffect(() => {
    if (toolbarPos && selectionRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(selectionRange);
      }
    }
  }, [toolbarPos, selectionRange]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        promptBoxRef.current &&
        !promptBoxRef.current.contains(e.target as Node)
      ) {
        setSelectedText("");
        setToolbarPos(null);
        setPromptInput("");
        setSelectionRange(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const fetchContents = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentHistory = async (contentId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}`
      );
      if (response.ok) {
        const data = await response.json();
        setContentHistory(data);
        setShowHistoryModal(true);
      }
    } catch (error) {
      console.error("Error fetching content history:", error);
    } finally {
      setIsLoading(false);
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
            ...campaignData,
            ...newContent,
            selectedContentIds: selectedContents
              .filter((content): content is Content => content !== null)
              .map((content) => content.id),
          }),
        }
      );

      if (response.ok) {
        setNewContent((prev) => ({
          ...prev,
          description: "",
        }));
        fetchContents();
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!editingContent) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${editingContent.id}/update`,
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreContent = async (contentId: number, restoreContentId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/content/${contentId}/restore`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            restoreContentId
          }),
        }
      );
      if (response.ok) {
        fetchContents();
        setShowHistoryModal(false);
      }
    } catch (error) {
      console.error("Error updating content:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
      selectedContents.filter((c) => c?.id !== contentToRemove.id)
    );
    setNewContent({
      ...newContent,
      description: newContent.description.replace(
        `Reference to previous content: ${contentToRemove.description}\n`,
        ""
      ),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptInput(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  };

  const handleSendPrompt = async (contentId: number) => {
    if (!promptInput.trim()) return;
    setRegeneratingContentId(contentId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/regenerate/${contentId}/fully`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            ...campaignData,
            promptInput
          }),
        }
      );

      if (response.ok) {
        fetchContents();
      }
    } catch (error) {
      console.error("Error regenerating content:", error);
    } finally {
      setPromptInput('');
      setRegeneratingContentId(null);
    }

    // Example API call or logic
    console.log(`Sending to AI: ${promptInput} for content #${contentId} with ${campaignId}`);
  };

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(e);
    setShowSettingsModal(false);
  };

  const setShowSettings = (show: boolean) => {
    setShowSettingsModal(show);
  };

  const setShowHistoryModal = (show: boolean) => {
    setShowHistory(show);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onCampaignDataChange({ [name]: value });
  };

  const handleRegenerate = async (contentId: number) => {
    if (!promptInput.trim()) return;
    setRegeneratingContentId(contentId);
    setToolbarPos(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns/${campaignId}/regenerate/${contentId}/partially`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            ...campaignData,
            promptInput,
            selectedText
          }),
        }
      );

      if (response.ok) {
        fetchContents();
      }
    } catch (error) {
      console.error("Error regenerating content:", error);
    } finally {
      setSelectedText("");
      setPromptInput("");
      setSelectionRange(null);
      setRegeneratingContentId(null);
    }
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <ModernLoader />}
      </AnimatePresence>

      {showHistory && (
        <>
          {/* Overlay Background */}
          <div
            onClick={() => setShowHistory(false)}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          />

          {/* History Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-[800px] bg-[#1a1f2e] z-50 transition-transform ${showHistory ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Chat History</h2>
              <button onClick={() => setShowHistoryModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)] px-4 py-2 space-y-4">
              {contentHistory.map((content, index) => {

                return (
                  <motion.div
                    key={content.id || index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 bg-[#2a2f3e] rounded-lg mb-6"
                  >
                    {/* Chat Messages */}
                    <div className="flex flex-col gap-4">

                      {/* User (Right) */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="self-end max-w-[70%] bg-[#4f5568] rounded-xl m-4 p-3 text-gray-100 text-sm text-right whitespace-pre-wrap"
                      >
                        {content.message.find((m) => m.role === "user")?.content || "No prompt"}
                      </motion.div>

                      {/* Assistant (Left) */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="self-start max-w-[75%] bg-[#3a3f4e] rounded-xl m-4 p-3 text-white text-sm whitespace-pre-wrap"
                      >
                        {/* Meta Info inside assistant bubble */}
                        <div className="mb-3 pt-2 text-xs text-gray-400 flex justify-between items-start gap-2">
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
                          <button
                            onClick={() => handleRestoreContent(content.content_id, content.id)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded font-medium text-sm text-gray-100"
                            title="Restore"
                          >
                            Restore
                          </button>
                        </div>
                        <div className="border-t border-gray-600 mb-2">
                          {content.message.find((m) => m.role === "assistant")?.content || "No response"}
                        </div>
                        <span className="ml-auto text-gray-500">
                          {new Date(content.created_at).toLocaleString()}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="bg-[#2a2f3e] rounded-lg p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold mb-6">Campaign Content</h2>
          <button
            onClick={() => setShowSettings(true)} // Replace with your own handler
            className="p-1 text-gray-400 hover:text-blue-400"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>

        </div>

        {/* New Campaign Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#2a2f3e] rounded-lg p-4 sm:p-6 w-full max-w-[400px]">
              <h2 className="text-xl font-bold mb-4">Update Campaign Details</h2>
              <form>
                <div className="mb-2">
                  <label className="block mb-2 text-sm font-medium">
                    Campaign Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                    value={campaignData.name}
                    onChange={handleChange}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>
                {/* Genre Selection */}
                <div className="mb-2">
                  <label className="block mb-2 text-sm font-medium">Genre</label>
                  <select
                    name="genre"
                    className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                    value={campaignData.genre}
                    onChange={handleChange}
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
                    name="tone"
                    className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                    value={campaignData.tone}
                    onChange={handleChange}
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
                    name="setting"
                    className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                    value={campaignData.setting}
                    onChange={handleChange}
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
                    onClick={() => setShowSettingsModal(false)}
                    className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSettingsUpdate}
                    type="button"
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Generation Form */}
        <form onSubmit={handleGenerateContent} className="mb-8">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Campaign Context Label */}
            <label className="col-span-3 block text-sm font-medium">
              Campaign Context
            </label>

            {categoryMap.map((category, index) => (
              <div key={index}>
                <select
                  className="w-full p-2 bg-[#1a1f2e] rounded-lg text-sm"
                  value={selectedContents[index]?.id || ""}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedContent = contents.find((c) => c.id === selectedId);
                    const updatedSelections = [...selectedContents];
                    updatedSelections[index] = selectedContent || null;
                    setSelectedContents(updatedSelections);
                  }}
                >
                  <option className="w-full" value="">Select previous {category} content...</option>
                  {contents
                    .filter((content) => content.content_category.toLowerCase() === category.toLowerCase())
                    .map((content) => (
                      <option key={content.id} value={content.id}>
                        {content.description.substring(0, 50)}...
                      </option>
                    ))}
                </select>

                {/* Show selected content below the dropdown */}
                {selectedContents[index] && (
                  <div className="mt-2 text-xs text-gray-300 bg-[#1a1f2e] p-2 rounded-lg">
                    {selectedContents[index]?.description.substring(0, 80)}...
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSelections = [...selectedContents];
                        updatedSelections[index] = null;
                        setSelectedContents(updatedSelections);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-400 float-right"
                      title="Remove reference"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
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
              <option value="World Building">World Building</option>
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
                    {/* Floating toolbar like Canvas */}
                    {toolbarPos && (
                      <motion.div
                        ref={promptBoxRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 max-w-md w-full bg-[#1a1f2e] border border-gray-700 shadow-xl rounded-xl p-4 backdrop-blur-lg"
                        style={{ top: toolbarPos.top, left: toolbarPos.left }}
                      >
                        <textarea
                          value={promptInput}
                          onChange={(e) => setPromptInput(e.target.value)}
                          placeholder="How would you like to change this text?"
                          className="w-full p-3 bg-[#2a2f3e] text-sm rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          rows={3}
                          autoFocus
                        />

                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedText("");
                              setToolbarPos(null);
                              setPromptInput("");
                              setSelectionRange(null);
                            }}
                            className="px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-700 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRegenerate(content.id)}
                            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 2a8 8 0 106.32 12.906l1.387 1.387a1 1 0 001.415-1.415l-1.387-1.387A8 8 0 0010 2z" />
                            </svg>
                            Regenerate
                          </button>
                        </div>
                      </motion.div>
                    )}

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
                        <button
                          onClick={() => fetchContentHistory(content.id)}
                          className="text-xs text-gray-400 px-2 bg-[#2a2f3e] rounded hover:text-yellow-400"
                          title="History"
                        >
                          History
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {content.description}
                    </p>
                    {regeneratingContentId === content.id ? (
                      <div className="flex justify-center items-center gap-2 text-blue-400 text-sm mt-4">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z">
                          </path>
                        </svg>
                        Regenerating content...
                      </div>
                    ) : (
                      <p ref={allowedRef} className="whitespace-pre-wrap">{content.content}</p>
                    )}

                    {chattingContentId === content.id && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-400">
                          Chat with AI about this section
                        </label>
                        <div className="flex gap-2">
                          <textarea
                            ref={promptInputRef}
                            value={promptInput}
                            onChange={handleInputChange}
                            className="flex-grow p-2 rounded bg-[#2a2f3e] text-sm resize-y min-h-[40px]"
                            placeholder="Ask AI about this content..."
                            rows={1}
                          />

                          <button
                            onClick={() => handleSendPrompt(content.id)}
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
    </>
  );
}