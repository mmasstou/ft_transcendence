import { RoomsType } from '@/types/types';
import { create } from 'zustand';
//

interface IChanneLPasswordAcces {
  IsOpen: boolean;
  room: RoomsType | null;
  onOpen: (room : RoomsType | null) => void;
  onClose: () => void;
}

const ChanneLPasswordAccessHook = create<IChanneLPasswordAcces>((set) => ({
  IsOpen: true,
  room : null,
  onOpen: (selectedRoom : RoomsType | null) => set({ IsOpen: true, room : selectedRoom }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLPasswordAccessHook;
