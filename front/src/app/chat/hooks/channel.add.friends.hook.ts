import { userType } from "@/types/types";
import { create } from "zustand";



interface ChanneLAddFriendsHookInterface {
  isOpen: boolean;
  selectedFriends: userType[];
  onOpen: () => void;
  onClose: () =>  userType[];
}

const ChanneLAddFriendsHookHook = create<ChanneLAddFriendsHookInterface>((set, item) => ({
  isOpen: false,
  selectedFriends: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
    return item().selectedFriends;
  }
}));

export default ChanneLAddFriendsHookHook;