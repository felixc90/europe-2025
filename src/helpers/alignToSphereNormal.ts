import * as THREE from "three";

export const alignToSphereNormal = (
  position: THREE.Vector3,
  angle: number = 0
) => {
  const normal = new THREE.Vector3().copy(position).normalize();

  const up = new THREE.Vector3(0, 1, 0);
  const res = new THREE.Quaternion().setFromUnitVectors(up, normal);
  const spinRotation = new THREE.Quaternion().setFromAxisAngle(up, angle);
  res.multiply(spinRotation);
  return res;
};
