import { create } from 'zustand';
//

interface IChanneLPasswordAcces {
  IsOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ChanneLPasswordAccessHook = create<IChanneLPasswordAcces>((set) => ({
  IsOpen: false,
  onOpen: () => set({ IsOpen: true }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLPasswordAccessHook;
