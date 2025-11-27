import { create } from "zustand";
import { CameraState as CameraStateType } from "../constants/CameraState";
import type { BoundingBox } from "../types/camera";

interface CameraState {
  cameraState: CameraStateType;
  setCameraState: (state: CameraStateType) => void;
  boundingBox: BoundingBox | null;
  setBoundingBox: (box: BoundingBox) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  cameraState: CameraStateType.OFF,
  setCameraState: (cameraState) => set(() => ({ cameraState })),
  boundingBox: null,
  setBoundingBox: (boundingBox) => set(() => ({ boundingBox })),
}));
