import * as THREE from "three";

const worldToScreen = (
  worldPosition: THREE.Vector3,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) => {
  const matrix = new THREE.Matrix4();
  const projected = worldPosition.clone();

  projected.applyMatrix4(
    matrix.copy(camera.matrixWorldInverse).premultiply(camera.projectionMatrix)
  );

  const viewSize = new THREE.Vector2(
    renderer.domElement.offsetWidth / 2.0,
    renderer.domElement.offsetHeight / 2.0
  );

  return new THREE.Vector2(
    projected.x * viewSize.x + viewSize.x,
    -projected.y * viewSize.y + viewSize.y
  );
};

export default worldToScreen;
