import { OLdMessages } from "@/types/types";
import { create } from "zustand"
// 

interface IRightsidebar {
    IsOpen: boolean;
    selectedItem: OLdMessages[] | null;
    onOpen: (item: OLdMessages[]) => void;
    onClose: () => void;
}


const RightsidebarHook = create<IRightsidebar>((set) => ({
    IsOpen: false,
    default: false,
    selectedItem: null,
    onOpen: (item: OLdMessages[]) => set({ IsOpen: true, selectedItem: item }),
    onClose: () => set({ IsOpen: false }),
}));

export default RightsidebarHook;