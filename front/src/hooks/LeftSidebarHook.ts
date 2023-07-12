import { create } from "zustand"
// 
import {OLdMessages as OLdMessagesType} from "../types/type.OLdMessages"

interface ILeftSidebar {
    IsOpen: boolean;
    default:boolean;
    selectedItem: OLdMessagesType[] | null;
    onOpen: (item: OLdMessagesType[]) => void;
    setDefault: (value: boolean) => void;
    onClose: () => void;
}


const LeftSidebarHook = create<ILeftSidebar>((set) => ({
    IsOpen: false,
    default: false,
    selectedItem: null,
    onOpen: (item: OLdMessagesType[]) => set({ IsOpen: true, selectedItem: item }),
    onClose: () => set({ IsOpen: false }),
    setDefault: (value : boolean) => set({ default: value }),
}));

export default LeftSidebarHook;