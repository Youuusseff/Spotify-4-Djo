import {create } from 'zustand';

interface FollowModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useFollowModal = create<FollowModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useFollowModal;