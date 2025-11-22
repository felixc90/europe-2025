import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

export const WaterShaderMaterial = shaderMaterial(
  {
    cameraPos: new THREE.Vector3(),
    waterColor: new THREE.Color("#4da6ff"),
    deepWaterColor: new THREE.Color("#003366"),

    // NEW:
    near: 50,
    far: 300,
  },
  // vertex shader...
  `
    varying vec3 vWorldPos;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  // fragment shader...
  `
    uniform vec3 cameraPos;
    uniform vec3 waterColor;
    uniform vec3 deepWaterColor;
    uniform float near;
    uniform float far;

    varying vec3 vWorldPos;

    void main() {
      float dist = distance(cameraPos, vWorldPos);

      // use the new dynamic params
      float t = smoothstep(near, far, dist);

      vec3 finalColor = mix(waterColor, deepWaterColor, t);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

declare module "@react-three/fiber" {
  interface ThreeElements {
    waterShaderMaterial: ThreeElement<typeof WaterShaderMaterial>;
  }
}

extend({ WaterShaderMaterial });

export default function WaterMaterial({ base = "#65e3ff", deep = "#308be0" }) {
  const { near, far } = useControls({
    near: { value: 3, min: 0, max: 20 },
    far: { value: 12, min: 0, max: 100 },
  });
  const ref = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current?.uniforms.cameraPos.value.copy(camera.position);
  });

  return (
    <waterShaderMaterial
      ref={ref}
      near={near}
      far={far}
      waterColor={new THREE.Color(base).convertLinearToSRGB()}
      deepWaterColor={new THREE.Color(deep).convertLinearToSRGB()}
    />
  );
}
