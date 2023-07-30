import { userType } from '@/types/types';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChanneLsettingsInterface {
  IsOpen: boolean;
  onOpen: (channeLId: string, socket: Socket | null) => void;
  onClose: () => void;
  selectedchanneL: string;
  socket: Socket | null;
}

const ChanneLsettingsHook = create<ChanneLsettingsInterface>((set) => ({
  IsOpen: false,
  socket: null,
  selectedchanneL: '',
  onOpen: (channeLId: string, socket: Socket | null) =>
    set({ IsOpen: true, selectedchanneL: channeLId, socket: socket }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLsettingsHook;
