import { RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";

const Map = () => {
  return (
    <RigidBody colliders="ball" lockTranslations lockRotations>
      <mesh scale={10} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <WaterMaterial />
      </mesh>
    </RigidBody>
  );
};

export default Map;
