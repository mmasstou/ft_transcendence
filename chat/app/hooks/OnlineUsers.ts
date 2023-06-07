import { create } from "zustand"

interface item {
    id: string;
    login:string;
    status: string
   
};
interface Idelete {
    IsOpen: boolean;
    selectedItem: item[] | null;
    onOpen: (item: item[]) => void;
    onClose: () => void;
}


const OnlineUsers = create<Idelete>((set) => ({
    IsOpen: false,
    selectedItem: null,
    onOpen: (item: item[]) => set({ IsOpen: true, selectedItem: item }),
    onClose: () => set({ IsOpen: false }),
}));

export default OnlineUsers;