import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

export const WaterShaderMaterial = shaderMaterial(
  {
    cameraPos: new THREE.Vector3(),
    waterColor: new THREE.Color("#65e3ff"),
    deepWaterColor: new THREE.Color("#308be0"),
    near: 3,
    far: 12,
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

export default function WaterMaterial() {
  const { near, far, base, deep } = useControls("Water Material", {
    base: "#65e3ff",
    deep: "#308be0",
    near: { value: 3, min: 0, max: 20 },
    far: { value: 12, min: 0, max: 100 },
  });

  const ref = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.uniforms.cameraPos.value.copy(camera.position);
    }
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
