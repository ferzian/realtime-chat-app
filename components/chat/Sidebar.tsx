import { Room } from "@/types/chat";

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number | null;
  onSelectRoom: (id: number) => void;
  onLogout: () => void;
}

export default function Sidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  onLogout,
}: SidebarProps) {
  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h1 className="font-bold text-slate-800 text-lg">Pesan</h1>
        <button
          onClick={onLogout}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Keluar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 text-center">
            Belum ada obrolan
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${
                activeRoomId === room.id
                  ? "bg-blue-50/70 border-l-4 border-l-blue-600"
                  : ""
              }`}
            >
              <p className="font-semibold text-slate-800 text-sm">
                {room.name || `Room #${room.id}`}
              </p>
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
  );
}
