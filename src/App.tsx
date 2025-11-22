import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";

function App() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, -5],
        }}
      >
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
