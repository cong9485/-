import React from 'react';
import { Room } from '../types';
import { Users, Layout, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  // Calculate available slots count
  const availableCount = room.slots.filter(s => !s.isBooked).length;

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{room.name}</h3>
          <p className="text-slate-200 text-sm">{room.type}</p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>최대 {room.capacity}명</span>
          </div>
          <div className="flex items-center gap-1">
            <Layout size={16} />
            <span>{room.floor}층</span>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{room.description}</p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm">
            <span className={`font-medium ${availableCount > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {availableCount}타임
            </span> 예약 가능
          </div>
          <button 
            onClick={() => onSelect(room)}
            className="flex items-center gap-1 text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
          >
            예약하기 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};