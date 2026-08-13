"use client";

import { useState, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
  X,
  Reply,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Message } from "@/types/chat";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface ChatInputProps {
  onSendMessage: (text: string, imageUrl?: string) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export default function ChatInput({
  onSendMessage,
  replyingTo,
  onCancelReply,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl) return;
    onSendMessage(text, imageUrl || undefined);
    setText("");
    setImageUrl(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const token = Cookies.get("token");
      const baseURL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

      const res = await fetch(`${baseURL}/messages/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        alert("Upload sukses tapi imageUrl tidak ada di response!");
      }
    } catch (error: any) {
      console.error("Failed to upload image", error);
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-amber-500 shrink-0">
              <Reply className="w-4 h-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Replying to {replyingTo.sender?.username || "someone"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-50 sm:max-w-400">
                {replyingTo.isDeleted
                  ? "This message was deleted"
                  : replyingTo.content ||
                    (replyingTo.imageUrl ? "📷 Photo" : "")}
              </span>
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="px-4 pt-3 pb-1 flex">
          <div className="relative group rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800/50 inline-block">
            <img
              src={imageUrl}
              alt="Upload preview"
              className="h-20 w-auto rounded-lg object-cover"
            />
            <button
              onClick={() => setImageUrl(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach image"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700/80 pl-4 pr-10 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50/40 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={(!text.trim() && !imageUrl) || isUploading}
          className="bg-zinc-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-zinc-900/10 dark:shadow-amber-600/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
