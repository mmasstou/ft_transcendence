import { create } from "zustand"

interface Icontact {
    IsOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}


const ContactHook = create<Icontact>((set) => ({
    IsOpen: false,
    onOpen: () => set({ IsOpen: true}),
    onClose: () => set({ IsOpen: false }),
}));

export default ContactHook;