import { create } from "zustand";

interface CharacterState {
  flying: boolean;
  setFlying: (state: boolean) => void;
}

export const useCharacterStore = create<CharacterState>()((set) => ({
  flying: false,
  setFlying: (flying) => set(() => ({ flying })),
}));
