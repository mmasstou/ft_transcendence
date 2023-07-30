import { create } from 'zustand';
//

interface ILeftSidebar {
  IsOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ChanneLaccessDeniedHook = create<ILeftSidebar>((set) => ({
  IsOpen: false,
  onOpen: () => set({ IsOpen: true }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLaccessDeniedHook;
