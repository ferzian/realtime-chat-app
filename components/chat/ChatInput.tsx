"use client";

import { useState } from "react";
import { Send, Smile, Paperclip, X, Reply } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export default function ChatInput({
  onSendMessage,
  replyingTo,
  onCancelReply,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
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
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-50 sm:max-w-100">
                {replyingTo.isDeleted
                  ? "This message was deleted"
                  : replyingTo.content}
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
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
      >
        <button
          type="button"
          className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
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
          disabled={!text.trim()}
          className="bg-zinc-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-zinc-900/10 dark:shadow-amber-600/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
