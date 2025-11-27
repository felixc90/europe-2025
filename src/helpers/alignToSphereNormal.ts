import * as THREE from "three";
export const alignToSphereNormal = (
  position: THREE.Vector3,
  rotation: THREE.Quaternion
) => {
  const nextUp = new THREE.Vector3().copy(position).normalize();

  const currentRotation = rotation;
  const currentQuat = new THREE.Quaternion(
    currentRotation.x,
    currentRotation.y,
    currentRotation.z,
    currentRotation.w
  );

  const localUp = new THREE.Vector3(0, 1, 0);
  localUp.applyQuaternion(currentRotation);

  const rotationQuat = new THREE.Quaternion().setFromUnitVectors(
    localUp,
    nextUp
  );
  rotationQuat.multiply(currentQuat);

  return rotationQuat;
};
