import { OLdMessages } from "@/types/types";
import { create } from "zustand"
// 

interface ILeftSidebar {
    IsOpen: boolean;
    default:boolean;
    selectedItem: OLdMessages[] | null;
    onOpen: (item: OLdMessages[]) => void;
    setDefault: (value: boolean) => void;
    onClose: () => void;
}


const LeftSidebarHook = create<ILeftSidebar>((set) => ({
    IsOpen: true,
    default: false,
    selectedItem: null,
    onOpen: (item: OLdMessages[]) => set({ IsOpen: true, selectedItem: item }),
    onClose: () => set({ IsOpen: false }),
    setDefault: (value : boolean) => set({ default: value }),
}));

export default LeftSidebarHook;