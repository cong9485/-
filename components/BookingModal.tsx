import React, { useState, useEffect } from 'react';
import { Room, TimeSlot } from '../types';
import { X, ArrowLeft, CreditCard, Users, Briefcase } from 'lucide-react';

interface BookingModalProps {
  room: Room;
  isOpen: boolean;
  purpose: string;
  onClose: () => void;
  onBook: (slotId: string, groupSize: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, purpose, onClose, onBook }) => {
  const [step, setStep] = useState<'slots' | 'details'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [groupSize, setGroupSize] = useState<number>(1);

  // Limit constants based on purpose
  const getLimit = () => {
    switch(purpose) {
      case '자습': return 6;
      case '휴식': return 4;
      case '회의': return room.capacity; // No specific limit mentioned, so use room capacity
      default: return room.capacity;
    }
  };

  const limit = getLimit();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('slots');
      setSelectedSlot(null);
      setGroupSize(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onBook(selectedSlot.id, `${groupSize}명`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            {step === 'details' && (
              <button 
                onClick={() => setStep('slots')}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {step === 'slots' ? room.name : '예약 확정'}
              </h2>
              <p className="text-slate-500 text-sm">
                {step === 'slots' ? room.type : `${room.name} • ${selectedSlot?.time}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 'slots' ? (
            <>
              <img 
                src={room.imageUrl} 
                alt={room.name} 
                className="w-full h-40 object-cover rounded-xl mb-6"
              />
              
              <p className="text-slate-600 mb-6 text-sm">
                {room.description}
              </p>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">시간 선택</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.slots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={slot.isBooked}
                      onClick={() => handleSlotClick(slot)}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border text-sm transition-all
                        ${slot.isBooked 
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="font-bold text-base">{slot.time}</span>
                      <span className="text-xs mt-1">
                        {slot.isBooked ? '예약 마감' : '예약 가능'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              
              {/* Payment Info */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-green-800 text-sm">무료 예약</h4>
                  <p className="text-green-700 text-xs">이 시설은 비용 없이 이용할 수 있습니다.</p>
                </div>
              </div>

              {/* Purpose Display (Read Only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Briefcase size={16} /> 사용 목적
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                  {purpose}
                </div>
              </div>

              {/* Group Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Users size={16} /> 이용 인원
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min={1} 
                    max={limit}
                    value={groupSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= limit) {
                        setGroupSize(val);
                      }
                    }}
                    className="w-24 p-3 border border-slate-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <div className="text-sm text-slate-500">
                    <p>현재 목적({purpose})의 최대 인원은</p>
                    <p className="font-semibold text-slate-700">{limit}명 입니다.</p>
                  </div>
                </div>
                <input 
                  type="range"
                  min={1}
                  max={limit}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="w-full mt-3 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={handleConfirm}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  예약 확정하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};