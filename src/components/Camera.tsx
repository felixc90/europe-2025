import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { lerpAngle } from "../utils/lerp";
import { useCameraStore } from "../stores/cameraStore";
import { CameraState } from "../constants/CameraState";
import worldToScreen from "../helpers/worldToScreen";

const Camera = () => {
  const CAMERA_WIDTH = 2;
  const CAMERA_HEIGHT = 1;
  const CAMERA_DEPTH = 1.5;
  const RADIUS = 2;
  const container = useRef<THREE.Group>(null);
  const OFF_ROTATION = -(3 * Math.PI) / 4;
  const ON_ROTATION = 0;
  const topLeft = useRef<THREE.Group>(null);
  const bottomRight = useRef<THREE.Group>(null);
  const { cameraState, setCameraState, setBoundingBox } = useCameraStore();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (!container || !container.current) return;
    const currRotation = container.current?.rotation;

    if (cameraState == CameraState.TURNING_OFF) {
      if (Math.abs(currRotation.x - OFF_ROTATION) < 1e-1) {
        setCameraState(CameraState.OFF);
        return;
      }
      const angle = lerpAngle(currRotation.x, OFF_ROTATION, 0.1);
      container.current?.rotation.copy(new THREE.Euler(angle, 0, 0));
    }
    if (cameraState == CameraState.TURNING_ON) {
      if (Math.abs(currRotation.x - ON_ROTATION) < 1e-2) {
        setCameraState(CameraState.ON);
        return;
      }
      const angle = lerpAngle(currRotation.x, ON_ROTATION, 0.1);
      container.current?.rotation.copy(new THREE.Euler(angle, 0, 0));
    }
  });

  const updateBoundingBox = useCallback(() => {
    if (!topLeft.current || !bottomRight.current) return;
    if (cameraState !== CameraState.ON) return;

    const topLeftPosition = new THREE.Vector3();
    const bottomRightPosition = new THREE.Vector3();

    topLeft.current.getWorldPosition(topLeftPosition);
    bottomRight.current.getWorldPosition(bottomRightPosition);

    setBoundingBox({
      topLeft: worldToScreen(topLeftPosition, camera, gl),
      bottomRight: worldToScreen(bottomRightPosition, camera, gl),
    });
  }, [cameraState, camera, gl, setBoundingBox]);

  useFrame(() => {
    if (cameraState === CameraState.ON && camera.matrixWorldNeedsUpdate) {
      updateBoundingBox();
    }
  });

  useEffect(() => {
    updateBoundingBox();
  }, [cameraState, updateBoundingBox]);

  useEffect(() => {
    window.addEventListener("resize", updateBoundingBox);
    return () => window.removeEventListener("resize", updateBoundingBox);
  }, [updateBoundingBox]);

  return (
    <group
      visible={cameraState != CameraState.OFF}
      position={[0, -CAMERA_HEIGHT / 2 - RADIUS, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <group ref={container} rotation={[OFF_ROTATION, 0, 0]}>
        <group position={[0, CAMERA_HEIGHT / 2 + RADIUS, 0]}>
          <mesh>
            <boxGeometry args={[CAMERA_WIDTH, CAMERA_HEIGHT, CAMERA_DEPTH]} />
            <meshBasicMaterial color="red" depthTest={false} />
          </mesh>
          <group position={[0, 0, CAMERA_DEPTH / 2 + 0.01]}>
            <group
              position={[-CAMERA_WIDTH / 2, CAMERA_HEIGHT / 2, 0]}
              ref={topLeft}
            />
            <group
              position={[CAMERA_WIDTH / 2, -CAMERA_HEIGHT / 2, 0]}
              ref={bottomRight}
            />
            <mesh>
              <planeGeometry args={[CAMERA_WIDTH, CAMERA_HEIGHT]} />
              <meshBasicMaterial color="#121212" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Camera;
