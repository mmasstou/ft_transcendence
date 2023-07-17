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