import { RoomsType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
//

interface IChanneLPasswordAcces {
  IsOpen: boolean;
  event: string;
  data: any;
  accesstype: 'ACCESS' | 'JOIN' | undefined;
  socket: Socket | null;
  room: RoomsType | null;
  password: string;
  onOpen: (
    room: RoomsType | null,
    socket: Socket | null,
    event: string,
    data: any,
    accesstype: 'ACCESS' | 'JOIN' | undefined
  ) => void;
  onClose: () => void;
  OnSave: (password: string) => void;
}

const ChanneLPasswordAccessHook = create<IChanneLPasswordAcces>((set) => ({
  IsOpen: false,
  room: null,
  event: '',
  accesstype: undefined,
  socket: null,
  data: null,
  password: '',
  onOpen: (
    selectedRoom: RoomsType | null,
    socket: Socket | null,
    event: string,
    data: any,
    accesstype: 'ACCESS' | 'JOIN' | undefined
  ) =>
    set({
      IsOpen: true,
      room: selectedRoom,
      socket: socket,
      event: event,
      data: data,
      accesstype: accesstype,
    }),
  OnSave: (password: string) => {
    set({ IsOpen: false, password: password });
  },
  onClose: () => {
    set({ IsOpen: false });
  },
}));

export default ChanneLPasswordAccessHook;
