import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Map from "../components/Map";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <color args={["#bdedfc"]} attach="background" />
      <ambientLight intensity={0.3} />
      <Physics debug={false} gravity={[0, 0, 0]}>
        <Map />
        <CharacterController />
      </Physics>
    </>
  );
};

export default Experience;
