export enum RoomType {
  CLASSROOM = '일반 교실',
  STUDY_ROOM = '자습실',
  MEETING_ROOM = '회의실',
  CLUB_ROOM = '동아리실',
  MULTIPURPOSE = '다목적실'
}

export interface TimeSlot {
  id: string;
  time: string; // e.g., "09:00 - 10:00"
  isBooked: boolean;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  imageUrl: string;
  description: string;
  floor: number;
  slots: TimeSlot[];
  equipment: string[];
}

export type BookingPurpose = '휴식' | '자습' | '회의';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  slotId: string;
  time: string;
  user: string;
  timestamp: number;
  purpose: string;
  groupSize: string;
}

export interface AISearchResult {
  recommendedRoomIds: string[];
  reasoning: string;
}