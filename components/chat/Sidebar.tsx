import { Room } from '@/types/chat';

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number | null;
  currentUserId?: number;
  onSelectRoom: (id: number) => void;
  onLogout: () => void;
}

export default function Sidebar({
  rooms = [],
  activeRoomId,
  currentUserId,
  onSelectRoom,
  onLogout,
}: SidebarProps) {
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const getRoomName = (room: Room) => {
    if (room.isGroup) {
      return room.name || `Group #${room.id}`;
    }
    
    const partner = room.participants?.find((p) => p.userId !== currentUserId);
    return partner?.user?.username || room.participants?.[0]?.user?.username || `Chat #${room.id}`;
  };

  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h1 className="font-bold text-slate-800 text-lg">Messages</h1>
        <button
          onClick={onLogout}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {safeRooms.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 text-center">
            No conversations yet
          </p>
        ) : (
          safeRooms.map((room) => (
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
                {getRoomName(room)}
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