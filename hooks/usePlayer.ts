import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    activeId?: string;
    hidden?: boolean;
    setHidden: (hidden: boolean) => void;
    setId: (id: string) => void;
    setIds: (ids: string[]) => void;
    reset: () => void;
};

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activeId: undefined,
    hidden: false,
    setHidden: (hidden: boolean) => set({ hidden }),
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids: ids}),
    reset: () => set({ activeId: undefined, ids: [] }),
}));

export default usePlayer;