import { Message } from "@/types/chat";

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col">
          <div className="max-w-md bg-white p-3 rounded-xl shadow-sm border border-slate-100 self-start">
            <p className="text-sm text-slate-800">
              {msg.isDeleted ? (
                <span className="italic text-slate-400">
                  🚫 This message was deleted
                </span>
              ) : (
                msg.content
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
