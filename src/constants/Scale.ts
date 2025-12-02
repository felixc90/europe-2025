import * as THREE from "three";
export const SCALABLE_REGIONS = ["nz", "nz_base"];
export const MIN_DISTANCE = 1;
export const MAX_DISTANCE = 3;
export const MIN_SCALE_VALUE = 0.18;
export const MIN_SCALE = new THREE.Vector3(
  MIN_SCALE_VALUE,
  MIN_SCALE_VALUE,
  MIN_SCALE_VALUE
);

export const MAX_SCALE_VALUE = 1;
export const MAX_SCALE = new THREE.Vector3(
  MAX_SCALE_VALUE,
  MAX_SCALE_VALUE,
  MAX_SCALE_VALUE
);

export const MAX_CAPSULE_HALF_HEIGHT = 0.08;
export const MAX_CAPSULE_RADIUS = 0.15;
export const MIN_CAPSULE_HALF_HEIGHT =
  MAX_CAPSULE_HALF_HEIGHT * MIN_SCALE_VALUE;
export const MIN_CAPSULE_RADIUS = MAX_CAPSULE_RADIUS * MIN_SCALE_VALUE;

const CAMERA_SCALE_CONSTANT = 0.15;
export const MAX_CAMERA_POSITION = new THREE.Vector3(0, 5, -3.5);
export const MIN_CAMERA_POSITION = new THREE.Vector3()
  .copy(MAX_CAMERA_POSITION)
  .multiplyScalar(CAMERA_SCALE_CONSTANT);

export const MAX_CAMERA_TARGET = new THREE.Vector3(0, 0, 0.5);
export const MIN_CAMERA_TARGET = new THREE.Vector3()
  .copy(MAX_CAMERA_POSITION)
  .multiplyScalar(CAMERA_SCALE_CONSTANT);
