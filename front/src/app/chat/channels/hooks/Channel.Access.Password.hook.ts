import { RoomsType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
//

interface IChanneLPasswordAcces {
  IsOpen: boolean;
  socket: Socket | null;
  room: RoomsType | null;
  onOpen: (room: RoomsType | null, socket: Socket | null) => void;
  onClose: () => void;
}

const ChanneLPasswordAccessHook = create<IChanneLPasswordAcces>((set) => ({
  IsOpen: false,
  room: null,
  socket: null,
  onOpen: (selectedRoom: RoomsType | null, socket: Socket | null) =>
    set({ IsOpen: true, room: selectedRoom, socket: socket }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLPasswordAccessHook;
