"use client";

import { Room } from "@/types/chat";
import { useState } from "react";
import NewChatModal from "./NewChatModal";
import { Plus, Search, MessageSquare, Users } from "lucide-react";

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number | null;
  currentUserId?: number;
  onSelectRoom: (id: number) => void;
  onLogout: () => void;
  onRefreshRooms: () => void;
}

export default function Sidebar({
  rooms = [],
  activeRoomId,
  currentUserId,
  onSelectRoom,
  onLogout,
  onRefreshRooms,
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const getRoomName = (room: Room) => {
    if (room.isGroup) {
      return room.name || `Group #${room.id}`;
    }

    const partner = room.participants?.find((p) => p.userId !== currentUserId);
    return (
      partner?.user?.username ||
      room.participants?.[0]?.user?.username ||
      `Chat #${room.id}`
    );
  };

  const filteredRooms = safeRooms.filter((room) => {
    const name = getRoomName(room).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="w-80 md:w-84 bg-white border-r border-slate-200/80 flex flex-col h-full shadow-xs shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Messages
            </h2>
            {safeRooms.length > 0 && (
              <span className="bg-amber-100/80 text-amber-900 border border-amber-200/60 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {safeRooms.length}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Start New Chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
          {filteredRooms.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-100">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {searchQuery ? "No matches found" : "No conversation yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                {searchQuery
                  ? "Try searching for another user or group name."
                  : "Start a new conversation to begin messaging."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100/80 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition border border-amber-200/70 cursor-pointer"
                >
                  <span>Start Chat</span>
                </button>
              )}
            </div>
          ) : (
            filteredRooms.map((room) => {
              const roomName = getRoomName(room);
              const initials = roomName
                .substring(0, 2)
                .toUpperCase();
              const isActive = activeRoomId === room.id;

              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`p-3.5 cursor-pointer transition-all duration-150 flex items-center gap-3.5 ${
                    isActive
                      ? "bg-amber-50/80 border-l-4 border-l-amber-500 text-slate-900"
                      : "hover:bg-slate-50/80 text-slate-700"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white shadow-xs ${
                        room.isGroup
                          ? "bg-linear-to-tr from-zinc-800 to-zinc-600"
                          : "bg-linear-to-tr from-amber-600 to-amber-400"
                      }`}
                    >
                      {room.isGroup ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        initials
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className={`text-sm truncate leading-tight ${
                          isActive
                            ? "font-bold text-amber-950"
                            : "font-semibold text-slate-800"
                        }`}
                      >
                        {roomName}
                      </h3>
                      {room.isGroup && (
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-md">
                          Group
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {room.messages && room.messages.length > 0
                        ? room.messages[0].content
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefreshRooms}
      />
    </>
  );
}
