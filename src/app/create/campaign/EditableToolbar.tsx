"use client";

import { motion } from "framer-motion";
import { useState, forwardRef } from "react";

interface EditableToolbarProps {
  contentId: number;
  selectedText: string;
  toolbarPos: { top: number; left: number };
  onRegenerate: (prompt: string) => void;
  onClose: () => void;
}

const EditableToolbar = forwardRef<HTMLDivElement, EditableToolbarProps>(
  ({ selectedText, toolbarPos, onRegenerate, onClose }, ref) => {
    const [showBox, setShowBox] = useState(false);
    const [prompt, setPrompt] = useState("");

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`absolute z-50 bg-[#1a1f2e] border border-gray-700 shadow-xl rounded-xl p-4 backdrop-blur-lg ${showBox ? "w-96" : "w-auto"
          }`}
        style={{ top: toolbarPos.top, left: toolbarPos.left }}
      >
        {!showBox ? (
          <button
            onClick={() => setShowBox(true)}
            className="flex items-center gap-2 text-sm w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 106.32 12.906l1.387 1.387a1 1 0 001.415-1.415l-1.387-1.387A8 8 0 0010 2z" />
            </svg>
            Improve
          </button>
        ) : (
          <div className="w-full">
            <textarea
              className="w-full bg-[#1a1f2e] border rounded p-2 text-sm"
              rows={2}
              placeholder="Enter how you'd like to improve the selected text..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={() => {
                  setShowBox(false);
                  setPrompt("");
                  onClose();
                }}
                className="px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRegenerate(prompt);
                  setShowBox(false);
                  setPrompt("");
                  onClose();
                }}
                className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 106.32 12.906l1.387 1.387a1 1 0 001.415-1.415l-1.387-1.387A8 8 0 0010 2z" />
                </svg>
                Regenerate
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

export default EditableToolbar;
