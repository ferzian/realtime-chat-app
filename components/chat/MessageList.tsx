import { Message } from "@/types/chat";
import { MessageSquare, Sparkles, AlertCircle } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUserId?: number;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center mb-3 shadow-md shadow-amber-500/10 border border-amber-200/60">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">No messages yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Send a greeting to break the ice and start conversing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAFBFD]/60">
      {messages.map((msg) => {
        const isMine = currentUserId ? msg.senderId === currentUserId : false;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
          >
            {!isMine && msg.sender?.username && (
              <span className="text-[11px] font-semibold text-amber-700 ml-1 mb-1">
                {msg.sender.username}
              </span>
            )}

            <div
              className={`p-3.5 max-w-xs sm:max-w-md transition-all ${
                isMine
                  ? "bg-zinc-900 text-white rounded-2xl rounded-tr-xs shadow-md shadow-zinc-900/10"
                  : "bg-white text-slate-800 rounded-2xl rounded-tl-xs shadow-xs border border-slate-100"
              }`}
            >
              <p className="text-sm leading-relaxed font-normal">
                {msg.isDeleted ? (
                  <span className="italic text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    This message was deleted
                  </span>
                ) : (
                  msg.content
                )}
              </p>
              {msg.createdAt && (
                <div
                  className={`text-[10px] mt-1.5 text-right font-medium ${
                    isMine ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
