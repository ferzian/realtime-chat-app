"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Users, User, X, AlertCircle, MessageSquare } from "lucide-react";

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base leading-tight">
                Start a New Chat
              </h2>
              <p className="text-xs text-slate-500">
                Connect with a contact or build a new group
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsGroup(false)}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isGroup
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Direct Message</span>
          </button>
          <button
            type="button"
            onClick={() => setIsGroup(true)}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isGroup
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs font-medium text-red-700 bg-red-50 p-3 rounded-xl border border-red-200/60 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isGroup ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target User ID
              </label>
              <input
                type="number"
                placeholder="Example: 2"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 placeholder:text-slate-400 transition-all bg-slate-50/50 focus:bg-white"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                placeholder="Example: Dev Project Team"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 placeholder:text-slate-400 transition-all bg-slate-50/50 focus:bg-white"
                required
              />
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded-xl transition shadow-md shadow-zinc-900/10 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {loading ? "Creating..." : "Start Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
