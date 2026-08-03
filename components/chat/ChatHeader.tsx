import { Room } from "@/types/chat";
import { Users, MoreVertical, Phone, Video, ShieldCheck } from "lucide-react";

interface ChatHeaderProps {
  roomId: number;
  room?: Room;
  currentUserId?: number;
}

export default function ChatHeader({
  roomId,
  room,
  currentUserId,
}: ChatHeaderProps) {
  const getRoomTitle = () => {
    if (!room) return `Room #${roomId}`;
    if (room.isGroup) return room.name || `Group #${room.id}`;

    const partner = room.participants?.find((p) => p.userId !== currentUserId);
    return (
      partner?.user?.username ||
      room.participants?.[0]?.user?.username ||
      `Chat #${room.id}`
    );
  };

  const title = getRoomTitle();
  const initials = title.substring(0, 2).toUpperCase();

  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
              room?.isGroup
                ? "bg-linear-to-tr from-zinc-800 to-zinc-600 dark:from-zinc-700 dark:to-zinc-500"
                : "bg-linear-to-tr from-amber-600 to-amber-400"
            }`}
          >
            {room?.isGroup ? <Users className="w-4 h-4" /> : initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
              {title}
            </h2>
            {room?.isGroup ? (
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-700/60">
                Group
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                • Active Now
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            <span>End-to-end Encrypted</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          title="More Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
