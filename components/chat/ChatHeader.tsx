export default function ChatHeader({ roomId }: { roomId: number }) {
  return (
    <div className="p-4 bg-white border-b border-slate-200 font-bold text-slate-800 text-sm">
      Room #{roomId}
    </div>
  );
}
