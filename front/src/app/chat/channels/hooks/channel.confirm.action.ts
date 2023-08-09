import React from 'react';
import { create } from 'zustand';
//

interface IChanneLConfirmAction {
  IsOpen: boolean;
  message: string;
  ConfirmBtn: React.ReactNode | null;
  onOpen: (ConfirmBtn: React.ReactNode | null, message : string) => void;
  onClose: () => void;
}

const ChanneLConfirmActionHook = create<IChanneLConfirmAction>((set) => ({
  IsOpen: false,
  ConfirmBtn: null,
  message: '',
  onOpen: (ConfirmBtn: React.ReactNode | null, message : string) =>
    set({ IsOpen: true, ConfirmBtn: ConfirmBtn, message: message }),
  onClose: () => set({ IsOpen: false }),
}));

export default ChanneLConfirmActionHook;
