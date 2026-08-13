import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";
import {
  AlertCircle,
  MessageSquare,
  Check,
  CheckCheck,
  Reply,
  Trash2,
} from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUserId?: number;
  isGroup?: boolean;
  onReply?: (msg: Message) => void;
  onDelete?: (msg: Message) => void;
}

export default function MessageList({
  messages,
  currentUserId,
  isGroup = true,
  onReply,
  onDelete,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 shadow-md shadow-amber-500/10 border border-amber-200/60 dark:border-amber-900/60">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
          No messages yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
          Send a greeting to break the ice and start conversing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAFBFD]/60 dark:bg-[#0B0F19]/60 transition-colors duration-200">
      {messages.map((msg) => {
        const isMine =
          currentUserId !== undefined &&
          Number(msg.senderId) === Number(currentUserId);

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
          >
            {!isMine && isGroup && msg.sender?.username && (
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 ml-1 mb-1">
                {msg.sender.username}
              </span>
            )}

            <div className="flex items-center gap-2 group relative">
              {!isMine && (
                <button
                  onClick={() => onReply && onReply(msg)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all absolute -right-10 cursor-pointer"
                  title="Reply"
                >
                  <Reply className="w-4 h-4" />
                </button>
              )}

              <div
                className={`p-3.5 max-w-xs sm:max-w-md transition-all ${
                  isMine
                    ? "bg-zinc-900 dark:bg-amber-600 text-white rounded-2xl rounded-tr-xs shadow-md shadow-zinc-900/10 dark:shadow-amber-600/10"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs shadow-xs border border-slate-100 dark:border-slate-700/60"
                }`}
              >
                {msg.replyTo && (
                  <div
                    className={`mb-2 p-2 rounded-xl text-xs border-l-2 ${
                      isMine
                        ? "bg-black/20 border-white/40 text-white/90"
                        : "bg-slate-100 dark:bg-slate-700/50 border-amber-500 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="font-semibold mb-0.5">
                      {msg.replyTo.sender?.username || "someone"}
                    </div>
                    <div className="truncate opacity-90">
                      {msg.replyTo.isDeleted
                        ? "This message was deleted"
                        : msg.replyTo.content ||
                          (msg.replyTo.imageUrl ? "📷 Photo" : "")}
                    </div>
                  </div>
                )}

                {msg.imageUrl && !msg.isDeleted && (
                  <div className="mb-2 rounded-xl overflow-hidden bg-black/10 flex items-center justify-center">
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded image"
                      className="max-w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                )}

                <p className="text-sm leading-relaxed font-normal wrap-break-words whitespace-pre-wrap">
                  {msg.isDeleted ? (
                    <span className="italic text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      This message was deleted
                    </span>
                  ) : (
                    msg.content
                  )}
                </p>

                {msg.createdAt && (
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 font-medium ${
                      isMine
                        ? "text-slate-400 dark:text-amber-200/80"
                        : "text-slate-400 dark:text-slate-400"
                    }`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMine && !msg.isDeleted && (
                      <span className="ml-1">
                        {msg.status === "READ" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                        ) : msg.status === "DELIVERED" ? (
                          <CheckCheck className="w-3.5 h-3.5 opacity-70" />
                        ) : (
                          <Check className="w-3.5 h-3.5 opacity-70" />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isMine && !msg.isDeleted && (
                <div className="opacity-0 group-hover:opacity-100 absolute -left-20 flex items-center gap-1.5 transition-all">
                  <button
                    onClick={() => onDelete && onDelete(msg)}
                    className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full shadow-sm cursor-pointer transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReply && onReply(msg)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 rounded-full shadow-sm cursor-pointer transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
