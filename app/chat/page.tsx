"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { Message, Room } from "@/types/chat";
import { MessageSquare, LogOut, User } from "lucide-react";

import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  );
  const [username, setUsername] = useState<string>("");

  const socketRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.sub) setCurrentUserId(payload.sub);
        if (payload?.id) setCurrentUserId(payload.id);
        if (payload?.username) setUsername(payload.username);
      } catch (e) {
        console.warn("Could not parse JWT token payload", e);
      }
    }
  }, []);

  const fetchRooms = useCallback(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data.data || res.data || []))
      .catch((err) => console.error("Failed to fetch rooms:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return router.push("/auth/login");

    fetchRooms();

    const socket = getSocket();
    socket.connect();
    socketRef.current = socket;

    socket.on("newMessage", (newMsg: Message) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("newMessage");
      disconnectSocket();
    };
  }, [router, fetchRooms]);

  useEffect(() => {
    if (!activeRoomId) return;

    api
      .get(`/messages/${activeRoomId}`)
      .then((res) => setMessages(res.data.data || res.data || []))
      .catch((err) => console.error("Failed to fetch messages:", err));

    if (socketRef.current) {
      socketRef.current.emit("joinRoom", { roomId: activeRoomId });
      socketRef.current.emit("markAsRead", { roomId: activeRoomId });
    }
  }, [activeRoomId]);

  const handleSendMessage = (text: string) => {
    if (!activeRoomId || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      roomId: activeRoomId,
      content: text,
    });
  };

  const handleLogout = () => {
    Cookies.remove("token");
    disconnectSocket();
    router.push("/auth/login");
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 animate-pulse">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600">
          Loading your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFD] text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-hidden">
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Realtime<span className="text-amber-600">Chat</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 border border-slate-200/60 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>

        <div className="flex items-center gap-3">
          {username && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100/60 border border-slate-200/50">
              <User className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-800">
                {username}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3.5 py-2 rounded-xl transition border border-red-200/50 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          currentUserId={currentUserId}
          onSelectRoom={setActiveRoomId}
          onLogout={handleLogout}
          onRefreshRooms={fetchRooms}
        />

        <main className="flex-1 flex flex-col bg-slate-50/50 relative min-w-0">
          {activeRoomId ? (
            <>
              <ChatHeader
                roomId={activeRoomId}
                room={activeRoom}
                currentUserId={currentUserId}
              />
              <MessageList messages={messages} currentUserId={currentUserId} />
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-tr from-amber-200/20 to-slate-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center mb-5 shadow-xl shadow-amber-500/20 border border-amber-300/40">
                <MessageSquare className="w-8 h-8 fill-white/20" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-900 bg-amber-100/80 border border-amber-200/70 mb-3">
                <span>Ready to Chat</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight max-w-md">
                Select a conversation to start messaging
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                Choose an existing chat from the left sidebar or create a new
                room to begin real-time messaging with elegance.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
