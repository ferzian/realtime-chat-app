"use client";

import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
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
        <button
          type="button"
          className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
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
  );
}
