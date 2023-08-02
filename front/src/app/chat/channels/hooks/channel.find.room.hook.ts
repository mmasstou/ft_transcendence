import { userType } from '@/types/types';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChanneLFindRoommodaLInterface {
  IsOpen: boolean;
  onOpen: (socket: Socket | null) => void;
  onClose: () => void;
  socket: Socket | null;
}

const ChanneLFindRoommodaLHook = create<ChanneLFindRoommodaLInterface>((set) => ({
  IsOpen: false,
  socket: null,
  selectedFriends: [],
  onOpen: (socket: Socket | null) => set({ IsOpen: true, socket: socket }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLFindRoommodaLHook;
