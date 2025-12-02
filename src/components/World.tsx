import { interactionGroups, RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";
import { useGLTF } from "@react-three/drei";
import { CollisionGroup } from "../constants/CollisionGroup";
import { useMapStore } from "../stores/mapStore";

const World = () => {
  const { nodes } = useGLTF("models/world.glb");
  const { setObjects } = useMapStore();
  setObjects(nodes);

  return (
    <group>
      <RigidBody
        userData={{ type: CollisionGroup.WATER }}
        colliders="ball"
        type="fixed"
        collisionGroups={interactionGroups(CollisionGroup.WATER, [
          CollisionGroup.CHARACTER,
          CollisionGroup.AIRPLANE,
        ])}
      >
        <primitive object={nodes.Sphere}>
          <WaterMaterial />
        </primitive>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        userData={{ type: CollisionGroup.TERRAIN }}
        collisionGroups={interactionGroups(CollisionGroup.TERRAIN, [
          CollisionGroup.CHARACTER,
          CollisionGroup.AIRPLANE,
        ])}
      >
        <group name="Australia">
          <primitive object={nodes.au}>
            <meshLambertMaterial color="#5fd18f" />
          </primitive>
          <primitive object={nodes.au_base}>
            <meshLambertMaterial color="#d6c3a6" />
          </primitive>
          <primitive object={nodes.au_tas}>
            <meshLambertMaterial color="#5fd18f" />
          </primitive>
          <primitive object={nodes.au_tas_base}>
            <meshLambertMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="New Zealand">
          <primitive object={nodes.nz}>
            <meshLambertMaterial color="#555555" />
          </primitive>
          <primitive object={nodes.nz_base}>
            <meshLambertMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="Antartica">
          <primitive object={nodes.aq}>
            <meshLambertMaterial color="#D8ECF3" />
          </primitive>
          <primitive object={nodes.aq_base}>
            <meshLambertMaterial color="#d6c3a6" />
          </primitive>
        </group>
        {/* <primitive object={nodes.Spain}>
          <meshLambertMaterial color="#f7a46a" />
        </primitive>
        <primitive object={nodes.Spain_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Portugal}>
          <meshLambertMaterial color="#f3c58a" />
        </primitive>
        <primitive object={nodes.Portugal_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.France}>
          <meshLambertMaterial color="#9fa8ff" />
        </primitive>
        <primitive object={nodes.France_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Europe}>
          <meshLambertMaterial color="#4A7BBE" />
        </primitive>
        <primitive object={nodes.Europe_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.North_America}>
          <meshLambertMaterial color="#2A7E8C" />
        </primitive>
        <primitive object={nodes.North_America_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.South_America}>
          <meshLambertMaterial color="#4fa565" />
        </primitive>
        <primitive object={nodes.South_America_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Africa}>
          <meshLambertMaterial color="#C89A3C" />
        </primitive>
        <primitive object={nodes.Africa_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Asia}>
          <meshLambertMaterial color="#C84A4A" />
        </primitive>
        <primitive object={nodes.Asia_base}>
          <meshLambertMaterial color="#d6c3a6" />
        </primitive> */}
      </RigidBody>
    </group>
  );
};

export default World;
