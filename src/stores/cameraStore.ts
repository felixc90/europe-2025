import { create } from "zustand";

interface CameraState {
  active: boolean;
  setActive: (active: boolean) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  active: true,
  setActive: (active) => set(() => ({ active })),
}));
