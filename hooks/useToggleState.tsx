import {create} from "zustand";

interface ToggleState {
    isEnabled: boolean;
    setIsEnabled: (value: boolean) => void;
}

const useToggleState = create<ToggleState>((set) => ({
    isEnabled: false,
    setIsEnabled: (value) => set({ isEnabled: value }),
}));

export default useToggleState;
