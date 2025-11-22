import { RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";

const Map = () => {
  return (
    <RigidBody colliders="ball" lockTranslations lockRotations>
      <mesh scale={1.5} position={[0, 0, 0]}>
        <sphereGeometry />
        <WaterMaterial base="#ffffff" deep="#ffffff" />
      </mesh>
    </RigidBody>
  );
};

export default Map;
