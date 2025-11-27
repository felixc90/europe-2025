import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { alignToSphereNormal } from "../helpers/alignToSphereNormal";
import { SPHERE_RADIUS } from "../constants/Sphere";

interface FlagProps {
  position: THREE.Vector3;
  texture: string;
  spin: number;
}

const Flag = ({ position, texture, spin }: FlagProps) => {
  const FLAGPOLE_HEIGHT = 1.25;
  const FLAGPOLE_RADIUS = 0.02;
  const FLAG_HEIGHT = 0.4;
  const FLAG_WIDTH = 0.55;
  const textureMap = useTexture(texture);
  const flag = useRef<THREE.Mesh>(null);
  const container = useRef<THREE.Group>(null);
  const time = useRef(0);

  // Create container geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(FLAG_WIDTH, FLAG_HEIGHT, 8, 8);
    return geo;
  }, []);

  // Animate the container
  useFrame((_, delta) => {
    if (!flag.current) return;

    time.current += delta;
    const positions = flag.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Create wave effect - waves propagate from left to right
      const waveX = Math.sin(x * 2 + time.current * 3) * 0.15;
      const waveY = Math.sin(y * 3 + time.current * 2) * 0.1;

      // Amplitude increases with distance from pole (x position)
      const amplitude = (0.5 * (x + FLAG_WIDTH / 2)) / FLAG_WIDTH;

      positions.setZ(i, (waveX + waveY) * amplitude);
    }

    positions.needsUpdate = true;
    flag.current.geometry.computeVertexNormals();
  });

  useEffect(() => {
    if (!container.current) return;
    const rotation = alignToSphereNormal(
      container.current?.position,
      new THREE.Quaternion().setFromEuler(container.current?.rotation)
    );

    container.current.setRotationFromQuaternion(rotation);

    const newPosition = new THREE.Vector3()
      .copy(container.current.position)
      .normalize()
      .multiplyScalar(SPHERE_RADIUS);
    container.current.position.copy(newPosition);
  }, [container, spin]);

  return (
    <group
      position={position}
      ref={container}
      rotation={[Math.PI / 2, spin, 0]}
    >
      <group
        position={[
          FLAG_WIDTH / 2 + FLAGPOLE_RADIUS / 2,
          FLAGPOLE_HEIGHT - FLAG_HEIGHT / 2 - 0.05,
          0,
        ]}
      >
        <pointLight
          intensity={0.015}
          decay={6}
          color="#ffffff"
          position={[0, 0, FLAG_WIDTH / 2]}
        />
        <pointLight
          intensity={0.015}
          decay={6}
          color="#ffffff"
          position={[0, 0, -FLAG_WIDTH / 2]}
        />
        <mesh ref={flag} geometry={geometry}>
          <meshStandardMaterial
            map={textureMap}
            side={THREE.DoubleSide}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
      <group position={[FLAGPOLE_RADIUS / 2, FLAGPOLE_HEIGHT / 2, 0]}>
        {/* Pole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry
            args={[FLAGPOLE_RADIUS, FLAGPOLE_RADIUS, FLAGPOLE_HEIGHT, 16]}
          />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Top sphere */}
        <mesh position={[0, FLAGPOLE_HEIGHT / 2, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

export default Flag;
