import * as THREE from "three";
import type { VectorLike } from "../types/rapier";

export const toVector3 = (vector: VectorLike) => {
  return new THREE.Vector3(vector.x, vector.y, vector.z);
};
