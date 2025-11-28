import { create } from "zustand";
import { CameraState as CameraStateType } from "../constants/CameraState";
import type { BoundingBox, Photo } from "../types/camera";

interface CameraState {
  cameraState: CameraStateType;
  setCameraState: (state: CameraStateType) => void;
  boundingBox: BoundingBox | null;
  setBoundingBox: (box: BoundingBox) => void;
  route: string;
  setRoute: (route: string) => void;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  cameraState: CameraStateType.OFF,
  setCameraState: (cameraState) => set(() => ({ cameraState })),
  route: "",
  setRoute: (route) => set(() => ({ route })),
  boundingBox: null,
  setBoundingBox: (boundingBox) => set(() => ({ boundingBox })),
  photos: [],
  setPhotos: (photos) => set(() => ({ photos })),
}));
