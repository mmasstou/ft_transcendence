import { create } from "zustand"


interface ILogin {
    IsOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}


const LoginHook = create<ILogin>((set) => ({
    IsOpen: false  ,
    selectedItem: null,
    onOpen: () => set({ IsOpen: true }),
    onClose: () => set({ IsOpen: false }),
}));

export default LoginHook;