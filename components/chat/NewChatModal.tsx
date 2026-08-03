"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roomId?: number | string) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onSuccess,
}: NewChatModalProps) {
  const [isGroup, setIsGroup] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/rooms", {
        isGroup,
        targetUserId: !isGroup ? Number(targetUserId) : undefined,
        name: isGroup ? groupName : undefined,
      });

      onSuccess(res.data?.id || res.data?.data?.id); 
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create a message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-lg border border-slate-100">
        <h2 className="font-bold text-slate-800 text-base mb-4">
          Start a New Chat
        </h2>

        <div className="flex bg-slate-100 p-1 rounded-lg mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsGroup(false)}
            className={`flex-1 py-1.5 rounded-md transition ${!isGroup ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
          >
            Direct Message
          </button>
          <button
            type="button"
            onClick={() => setIsGroup(true)}
            className={`flex-1 py-1.5 rounded-md transition ${isGroup ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
          >
            Create Group
          </button>
        </div>

        {error && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isGroup ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ID User Target
              </label>
              <input
                type="number"
                placeholder="Example: 2"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Group Name
              </label>
              <input
                type="text"
                placeholder="example: Project Dev"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Create Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
