import { create } from "zustand";

interface CharacterState {
  isFlying: boolean;
  setIsFlying: (isFlying: boolean) => void;
}

export const useCharacterStore = create<CharacterState>()((set) => ({
  isFlying: false,
  setIsFlying: (isFlying) => set(() => ({ isFlying })),
}));
