"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { Message, Room } from "@/types/chat";

import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<any>(null);
  const router = useRouter();

  const fetchRooms = useCallback(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data.data || []))
      .catch((err) => console.error("Gagal mengambil daftar room:", err))
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
      .catch((err) => console.error("Gagal mengambil pesan:", err));

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        onLogout={handleLogout}
        onRefreshRooms={fetchRooms}
      />

      <div className="flex-1 flex flex-col bg-slate-50">
        {activeRoomId ? (
          <>
            <ChatHeader roomId={activeRoomId} />
            <MessageList messages={messages} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a chat from the sidebar to start a message
          </div>
        )}
      </div>
    </div>
  );
}
