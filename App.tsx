import React, { useState } from 'react';
import { Room, Booking, BookingPurpose } from './types';
import { INITIAL_ROOMS } from './constants';
import { RoomCard } from './components/RoomCard';
import { BookingModal } from './components/BookingModal';
import { Calendar, LayoutDashboard, BookOpen, Trash2, Users, Briefcase } from 'lucide-react';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<'browse' | 'my-bookings'>('browse');
  
  // Selection State
  const [selectedPurpose, setSelectedPurpose] = useState<BookingPurpose | null>(null);

  // Filter Logic
  const getFilteredRooms = () => {
    if (!selectedPurpose) return [];

    return rooms.filter(room => {
      switch (selectedPurpose) {
        case '휴식':
          return room.name === '시울림교실';
        case '자습':
          return room.name === '덕송실' || room.name === '즉시분리실';
        case '회의':
          return room.name === '즉시분리실' || room.name === '동아리실';
        default:
          return false;
      }
    });
  };

  const displayedRooms = getFilteredRooms();

  // Handle slot booking
  const handleBookSlot = (slotId: string, groupSize: string) => {
    if (!selectedRoom || !selectedPurpose) return;

    const slot = selectedRoom.slots.find(s => s.id === slotId);
    if (!slot) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      slotId: slot.id,
      time: slot.time,
      user: '현재 사용자',
      timestamp: Date.now(),
      purpose: selectedPurpose,
      groupSize
    };

    setBookings(prev => [newBooking, ...prev]);

    setRooms(prevRooms => prevRooms.map(r => {
      if (r.id === selectedRoom.id) {
        return {
          ...r,
          slots: r.slots.map(s => s.id === slotId ? { ...s, isBooked: true } : s)
        };
      }
      return r;
    }));

    setSelectedRoom(null);
    alert(`${selectedRoom.name} 예약이 완료되었습니다!`);
    setView('my-bookings');
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
      setBookings(prev => prev.filter(b => b.id !== bookingId));

      setRooms(prevRooms => prevRooms.map(r => {
        if (r.id === booking.roomId) {
          return {
            ...r,
            slots: r.slots.map(s => s.id === booking.slotId ? { ...s, isBooked: false } : s)
          };
        }
        return r;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('browse'); setSelectedPurpose(null); }}>
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">UniSpace</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setView('browse')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'browse' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900'}`}
              >
                교실 찾기
              </button>
              <button 
                onClick={() => setView('my-bookings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'my-bookings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900'}`}
              >
                내 예약 ({bookings.length})
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {view === 'browse' && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">어떤 공간이 필요하신가요?</h1>
              <p className="text-slate-600 max-w-xl mx-auto mb-8">
                사용 목적을 먼저 선택하시면 적합한 교실을 안내해 드립니다.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {(['자습', '회의', '휴식'] as BookingPurpose[]).map((purpose) => (
                  <button
                    key={purpose}
                    onClick={() => setSelectedPurpose(purpose)}
                    className={`
                      px-6 py-3 rounded-full text-base font-semibold transition-all shadow-sm
                      ${selectedPurpose === purpose 
                        ? 'bg-indigo-600 text-white shadow-md scale-105' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
            </div>

            {selectedPurpose ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {displayedRooms.length > 0 ? (
                  displayedRooms.map(room => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      onSelect={setSelectedRoom} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-slate-400">
                    <p>해당 목적에 맞는 사용 가능한 교실이 없습니다.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                <LayoutDashboard className="mx-auto h-16 w-16 text-indigo-100 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">목적을 선택해주세요</h3>
                <p className="text-slate-500 mt-2">위 버튼을 눌러 교실 종류를 확인할 수 있습니다.</p>
              </div>
            )}
          </div>
        )}

        {view === 'my-bookings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">나의 예약 현황</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-slate-200">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">예약 내역이 없습니다</h3>
                <p className="text-slate-500 mb-6">아직 예약된 교실이 없습니다.</p>
                <button 
                  onClick={() => setView('browse')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  교실 예약하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 hidden sm:block">
                        <Calendar size={24} />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 text-lg">{booking.roomName}</h3>
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            예약 확정
                          </span>
                        </div>
                        <div className="flex items-center text-slate-600 mt-1 mb-3">
                          <span className="font-medium">{booking.time}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            <Briefcase size={12} /> {booking.purpose}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            <Users size={12} /> {booking.groupSize}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <button 
                         onClick={() => handleCancelBooking(booking.id)}
                         className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-end"
                      >
                        <Trash2 size={16} /> 예약 취소
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedRoom && selectedPurpose && (
        <BookingModal 
          room={selectedRoom} 
          isOpen={!!selectedRoom} 
          purpose={selectedPurpose}
          onClose={() => setSelectedRoom(null)}
          onBook={handleBookSlot}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} UniSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}