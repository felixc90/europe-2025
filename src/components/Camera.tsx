import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { lerpAngle } from "../utils/lerp";
import { useCameraStore } from "../stores/cameraStore";

const Camera = () => {
  const CAMERA_WIDTH = 2;
  const CAMERA_HEIGHT = 1;
  const CAMERA_DEPTH = 1.5;
  const RADIUS = 2;
  const groupRef = useRef<THREE.Group>(null);
  const INITIAL_ROTATION = -(3 * Math.PI) / 4;
  const FINAL_ROTATION = 0;
  const { active } = useCameraStore();
  useFrame(() => {
    const currRotation = groupRef.current?.rotation;
    const angle = lerpAngle(
      currRotation?.x ?? 0,
      active ? FINAL_ROTATION : INITIAL_ROTATION,
      0.1
    );
    groupRef.current?.rotation.copy(new THREE.Euler(angle, 0, 0));
  });

  return (
    <group
      position={[0, -CAMERA_HEIGHT / 2 - RADIUS, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <group ref={groupRef} rotation={[INITIAL_ROTATION, 0, 0]}>
        <group position={[0, CAMERA_HEIGHT / 2 + RADIUS, 0]}>
          <mesh>
            <boxGeometry args={[CAMERA_WIDTH, CAMERA_HEIGHT, CAMERA_DEPTH]} />
            <meshBasicMaterial color="red" />
          </mesh>
          <mesh position={[0, 0, CAMERA_DEPTH / 2 + 0.01]} scale={0.9}>
            <planeGeometry args={[CAMERA_WIDTH, CAMERA_HEIGHT]} />
            <meshBasicMaterial color="blue" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default Camera;
