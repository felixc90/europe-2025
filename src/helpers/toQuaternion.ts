import * as THREE from "three";
import type { RotationLike } from "../types/rapier";

export const toQuaternion = (rotation: RotationLike) => {
  const res = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );
  console.log("res", res);
  return res;
};
