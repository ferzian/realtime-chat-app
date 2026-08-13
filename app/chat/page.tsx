"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { Message, Room } from "@/types/chat";
import { MessageSquare, LogOut, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const socketRef = useRef<any>(null);
  const activeRoomIdRef = useRef<number | null>(null);
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

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket:", socket.id);
      socket.emit("subscribeGlobal"); // Daftarkan user ke channel global untuk notifikasi sidebar
    });

    socket.on("roomsUpdated", () => {
      fetchRooms(); // Refresh daftar obrolan di sidebar
    });

    socket.on("newMessage", (newMsg: Message) => {
      setMessages((prev) => {
        // Jika pesan baru bukan untuk room yang sedang kita buka, abaikan
        // (Sidebar akan tetap update karena ada event roomsUpdated)
        if (activeRoomIdRef.current !== newMsg.roomId) {
          return prev;
        }
        
        // Jika pesan baru ini untuk room yang sedang terbuka, beritahu server kita sudah membacanya!
        socket.emit("markAsRead", { roomId: newMsg.roomId });
        
        return [...prev, newMsg];
      });
    });

    socket.on("messagesRead", (data: { roomId: number; readBy: number }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const senderId = msg.sender?.id || msg.senderId;
          // Tandai pesan yang BUKAN dikirim oleh si pembaca (berarti pesan kita) menjadi READ
          if (senderId !== data.readBy && msg.status !== "READ") {
            return { ...msg, status: "READ" };
          }
          return msg;
        })
      );
    });

    socket.on("messageDeleted", (data: { messageId: number; roomId: number; content: string; isDeleted: boolean }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, isDeleted: data.isDeleted, content: data.content, imageUrl: undefined }
            : msg
        )
      );
    });

    socket.on("exception", (err: any) => {
      console.error("🚨 WsJwtGuard Error:", err);
      if (err?.message) alert(`Error: ${err.message}`);
    });

    return () => {
      socket.off("connect");
      socket.off("roomsUpdated");
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("messageDeleted");
      socket.off("exception");
    };
  }, [router, fetchRooms]);

  useEffect(() => {
    if (!activeRoomId) return;
    activeRoomIdRef.current = activeRoomId;

    api
      .get(`/messages/${activeRoomId}`)
      .then((res) => setMessages(res.data.data || res.data || []))
      .catch((err) => console.error("Gagal mengambil pesan:", err));

    if (socketRef.current && socketRef.current.connected) {
      console.log(`Emitting joinRoom for room: ${activeRoomId}`);
      socketRef.current.emit("joinRoom", { roomId: Number(activeRoomId) });
      socketRef.current.emit("markAsRead", { roomId: Number(activeRoomId) });
    }
  }, [activeRoomId]);

  const handleSendMessage = (text: string, imageUrl?: string) => {
    if (!activeRoomId || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      roomId: Number(activeRoomId),
      content: text,
      imageUrl: imageUrl,
      replyToId: replyingTo?.id,
    });

    setReplyingTo(null);
  };

  const handleDeleteMessage = (msg: Message) => {
    if (!activeRoomId || !socketRef.current) return;
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      socketRef.current.emit("deleteMessage", {
        messageId: msg.id,
        roomId: Number(activeRoomId),
      });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    disconnectSocket();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] dark:bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 animate-pulse">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFD] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-hidden transition-colors duration-200">
      <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            Realtime
            <span className="text-amber-600 dark:text-amber-500">Chat</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>

        <div className="flex items-center gap-3">
          {username && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {username}
              </span>
            </div>
          )}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100/80 dark:hover:bg-red-900/60 px-3.5 py-2 rounded-xl transition border border-red-200/50 dark:border-red-800/50 cursor-pointer"
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

        <main className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 relative min-w-0">
          {activeRoomId ? (
            <>
              <ChatHeader
                roomId={activeRoomId}
                room={rooms.find((r) => r.id === activeRoomId)}
                currentUserId={currentUserId}
                onClose={() => setActiveRoomId(null)}
              />
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                onReply={setReplyingTo}
                onDelete={handleDeleteMessage}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-tr from-amber-200/20 dark:from-amber-900/10 to-slate-200/30 dark:to-slate-900/30 rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center mb-5 shadow-xl shadow-amber-500/20 border border-amber-300/40">
                <MessageSquare className="w-8 h-8 fill-white/20" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200/70 dark:border-amber-700/60 mb-3">
                <span>Ready to Chat</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-md">
                Select a conversation to start messaging
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
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
