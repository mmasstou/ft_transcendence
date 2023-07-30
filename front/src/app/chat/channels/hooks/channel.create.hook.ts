<<<<<<< HEAD
import { userType } from '@/types/types';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChanneLcreatemodaLInterface {
  IsOpen: boolean;
  onOpen: (Friend: userType[], socket: Socket | null) => void;
  onClose: () => void;
  selectedFriends: userType[];
  socket: Socket | null;
}

const ChanneLcreatemodaLHook = create<ChanneLcreatemodaLInterface>((set) => ({
  IsOpen: false,
  socket: null,
  selectedFriends: [],
  onOpen: (Friend: userType[], socket: Socket | null) =>
    set({ IsOpen: true, selectedFriends: Friend, socket: socket }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLcreatemodaLHook;
=======
import { userType } from "@/types/types";
import { create } from "zustand"

interface ChanneLcreatemodaLInterface {
    IsOpen: boolean;
    onOpen: (Friend : userType[]) => void;
    onClose: () => void;
    selectedFriends: userType[];
}


const ChanneLcreatemodaLHook = create<ChanneLcreatemodaLInterface>((set) => ({
    IsOpen: false,
    selectedFriends: [],
    onOpen: (Friend : userType[]) => set({ IsOpen: true, selectedFriends: Friend}),
    onClose: () => set({ IsOpen: false }),
}));

export default ChanneLcreatemodaLHook;
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
