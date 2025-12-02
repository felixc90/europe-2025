import type { Object3D, Object3DEventMap } from "three";
import type { ConvexHull } from "three/examples/jsm/Addons.js";
import { create } from "zustand";

interface MapState {
  mapObjects: {
    [name: string]: Object3D<Object3DEventMap>;
  };
  setMapObjects: (mapObjects: {
    [name: string]: Object3D<Object3DEventMap>;
  }) => void;
  convexHulls: {
    [name: string]: ConvexHull;
  };
  setConvexHulls: (name: string, hull: ConvexHull) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  mapObjects: {},
  setMapObjects: (mapObjects) =>
    set((state) => ({ mapObjects: { ...state.mapObjects, ...mapObjects } })),
  convexHulls: {},
  setConvexHulls: (name, hull) =>
    set((state) => ({ convexHulls: { ...state.convexHulls, [name]: hull } })),
}));
