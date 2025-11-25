import { interactionGroups, RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";
import { useGLTF } from "@react-three/drei";
import { COLLISION_GROUPS } from "../constants/CollisionGroups";

const Map = () => {
  const { nodes } = useGLTF("models/world.glb");
  console.log(nodes);
  return (
    <group rotation={[-Math.PI / 2, 0, Math.PI]}>
      <RigidBody
        userData={{ type: COLLISION_GROUPS.WATER }}
        colliders="ball"
        type="fixed"
        collisionGroups={interactionGroups(COLLISION_GROUPS.WATER, [
          COLLISION_GROUPS.CHARACTER,
          COLLISION_GROUPS.AIRPLANE,
        ])}
      >
        <primitive object={nodes.Sphere}>
          <WaterMaterial />
        </primitive>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        userData={{ type: COLLISION_GROUPS.TERRAIN }}
        collisionGroups={interactionGroups(COLLISION_GROUPS.TERRAIN, [
          COLLISION_GROUPS.CHARACTER,
          COLLISION_GROUPS.AIRPLANE,
        ])}
      >
        <primitive object={nodes.Australia}>
          <meshLambertMaterial color="#5fd18f" />
        </primitive>
        <primitive object={nodes.Australia_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Australia_Tas}>
          <meshLambertMaterial color="#5fd18f" />
        </primitive>
        <primitive object={nodes.Australia_Tas_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Spain}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Portugal}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.France}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
      </RigidBody>
    </group>
  );
};

export default Map;
