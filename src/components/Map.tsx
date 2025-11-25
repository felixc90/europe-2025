import { interactionGroups, RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";
import { useGLTF } from "@react-three/drei";

const Map = () => {
  const { nodes } = useGLTF("models/world.glb");

  console.log(nodes);
  return (
    <group rotation={[-Math.PI / 2, 0, Math.PI]}>
      <RigidBody
        colliders="ball"
        type="fixed"
        collisionGroups={interactionGroups(0, [1, 2, 3, 4, 5])}
      >
        <primitive object={nodes.Sphere}>
          <WaterMaterial />
        </primitive>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        collisionGroups={interactionGroups(0, [1, 2, 3, 4, 5])}
      >
        <primitive object={nodes.Australia}>
          <meshLambertMaterial color="#5fd18f" />
        </primitive>
        <primitive object={nodes.Australia_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        collisionGroups={interactionGroups(0, [1, 2, 3, 4, 5])}
      >
        <primitive object={nodes.Australia_Tas}>
          <meshLambertMaterial color="#5fd18f" />
        </primitive>
        <primitive object={nodes.Australia_Tas_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
      </RigidBody>
    </group>
  );
};

export default Map;
