import { create } from "zustand"

interface item {
    id: string;
    login:string;
    status: string
   
};
interface IRightSidebarHook {
    IsOpen: boolean;
    selectedItem: item[] | null;
    onOpen: (item: item[]) => void;
    onClose: () => void;
}


const RightSidebarHook = create<IRightSidebarHook>((set) => ({
    IsOpen: false,
    selectedItem: null,
    onOpen: (item: item[]) => set({ IsOpen: true, selectedItem: item }),
    onClose: () => set({ IsOpen: false }),
}));

export default RightSidebarHook;