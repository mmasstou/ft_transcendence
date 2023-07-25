import { create } from "zustand"

interface IAlert {
    IsOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}


const ConnectionHook = create<IAlert>((set) => ({
    IsOpen: false,
    onOpen: () => set({ IsOpen: true}),
    onClose: () => set({ IsOpen: false }),
}));

export default ConnectionHook;