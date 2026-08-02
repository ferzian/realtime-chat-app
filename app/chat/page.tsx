'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { getSocket, disconnectSocket } from '@/lib/socket';

// Interface Data
interface Room {
  id: number;
  name?: string;
  messages?: Array<{ content: string; createdAt: string }>;
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  isDeleted?: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<any>(null);
  const router = useRouter();

  // 1. Cek Token & Fetch Daftar Room
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error('Gagal mengambil daftar room:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Inisialisasi Socket
    const socket = getSocket();
    socket.connect();
    socketRef.current = socket;

    // Listen Event Pesan Baru Real-time
    socket.on('newMessage', (newMsg: Message) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off('newMessage');
      disconnectSocket();
    };
  }, [router]);

  // 2. Fetch Riwayat Pesan Saat Room Dipilih & Emit joinRoom
  useEffect(() => {
    if (!activeRoomId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeRoomId}`);
        // Asumsi data pesan berupa array
        setMessages(res.data.data || res.data);
      } catch (err) {
        console.error('Gagal mengambil riwayat pesan:', err);
      }
    };

    fetchMessages();

    // Bergabung ke Channel WebSocket Room
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', { roomId: activeRoomId });
      socketRef.current.emit('markAsRead', { roomId: activeRoomId });
    }
  }, [activeRoomId]);

  // 3. Kirim Pesan Real-Time
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRoomId || !socketRef.current) return;

    // Emit event sendMessage ke WebSocket NestJS
    socketRef.current.emit('sendMessage', {
      roomId: activeRoomId,
      content: inputText,
    });

    setInputText('');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    disconnectSocket();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat Obrolan...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* --- SIDEBAR: DAFTAR ROOM --- */}
      <div className="w-1/3 max-w-xs bg-white border-r border-slate-200 flex flex-col">
        {/* Header Sidebar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h1 className="font-bold text-slate-800 text-lg">Pesan</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Keluar
          </button>
        </div>

        {/* List Room */}
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <p className="p-4 text-xs text-slate-400 text-center">Belum ada obrolan</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${
                  activeRoomId === room.id ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <p className="font-semibold text-slate-800 text-sm">{room.name || `Room #${room.id}`}</p>
                {room.messages && room.messages.length > 0 && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {room.messages[0].content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {activeRoomId ? (
          <>
            {/* Header Chat Window */}
            <div className="p-4 bg-white border-b border-slate-200 font-bold text-slate-800 text-sm">
              Room #{activeRoomId}
            </div>

            {/* Bubble Chat Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className="max-w-md bg-white p-3 rounded-xl shadow-sm border border-slate-100 self-start">
                    <p className="text-sm text-slate-800">
                      {msg.isDeleted ? (
                        <span className="italic text-slate-400">🚫 Pesan ini telah dihapus</span>
                      ) : (
                        msg.content
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Chat Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Pilih obrolan dari sidebar untuk memulai pesan
          </div>
        )}
      </div>
    </div>
  );
}