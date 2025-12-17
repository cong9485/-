import { Room, RoomType, TimeSlot } from './types';

// Helper to generate slots
const generateSlots = (): TimeSlot[] => [
  { id: 's1', time: '18:30 - 19:50', isBooked: false },
  { id: 's2', time: '20:05 - 21:25', isBooked: false },
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'siulim',
    name: '시울림교실',
    type: RoomType.MULTIPURPOSE,
    capacity: 4,
    floor: 2,
    imageUrl: 'https://picsum.photos/600/400?random=10',
    description: '소규모 대화 및 휴식에 적합한 아늑한 공간입니다.',
    equipment: ['소파', '테이블', '블루투스 스피커'],
    slots: generateSlots(),
  },
  {
    id: 'deoksong',
    name: '덕송실',
    type: RoomType.STUDY_ROOM,
    capacity: 20,
    floor: 3,
    imageUrl: 'https://picsum.photos/600/400?random=11',
    description: '조용한 분위기에서 집중적인 자습을 할 수 있는 공간입니다.',
    equipment: ['개인 책상', 'LED 조명', '공기청정기'],
    slots: generateSlots(),
  },
  {
    id: 'separation',
    name: '즉시분리실',
    type: RoomType.CLASSROOM,
    capacity: 8,
    floor: 1,
    imageUrl: 'https://picsum.photos/600/400?random=12',
    description: '자습 또는 회의를 진행할 수 있는 다목적 공간입니다.',
    equipment: ['화이트보드', '대형 TV', '회의용 테이블'],
    slots: generateSlots(),
  },
  {
    id: 'club',
    name: '동아리실',
    type: RoomType.CLUB_ROOM,
    capacity: 15,
    floor: 4,
    imageUrl: 'https://picsum.photos/600/400?random=13',
    description: '자유로운 분위기에서 회의 및 동아리 활동을 할 수 있습니다.',
    equipment: ['빔 프로젝터', '음향 장비', '전신 거울', '화이트보드'],
    slots: generateSlots(),
  },
];