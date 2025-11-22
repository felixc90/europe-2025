import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const WaterShaderMaterial = shaderMaterial(
  {
    cameraPos: new THREE.Vector3(),
    waterColor: new THREE.Color("#4da6ff"),
    deepWaterColor: new THREE.Color("#003366"),
  },
  // vertex shader
  `
    varying vec3 vWorldPos;

    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  // fragment shader
  `
    uniform vec3 cameraPos;
    uniform vec3 waterColor;
    uniform vec3 deepWaterColor;
    varying vec3 vWorldPos;

    void main() {
      float dist = distance(cameraPos, vWorldPos);

      float t = smoothstep(0.0, 1.0, dist);

      vec3 finalColor = mix(waterColor, deepWaterColor, t);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ WaterShaderMaterial });

export default function WaterMaterial({ base = "#65e3ff", deep = "#003366" }) {
  const ref = useRef(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.cameraPos.copy(camera.position);
  });

  return (
    <waterShaderMaterial
      ref={ref}
      waterColor={new THREE.Color(base)}
      deepWaterColor={new THREE.Color(deep)}
    />
  );
}
