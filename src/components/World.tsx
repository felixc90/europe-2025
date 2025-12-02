import { interactionGroups, RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";
import { useGLTF, useTexture } from "@react-three/drei";
import { CollisionGroup } from "../constants/CollisionGroup";
import { useEffect } from "react";
import { useMapStore } from "../stores/mapStore";
import { SCALABLE_REGIONS } from "../constants/Scale";
import { ConvexHull } from "three/examples/jsm/Addons.js";

const World = () => {
  const { nodes } = useGLTF("models/world.glb");
  const { setMapObjects, setConvexHulls } = useMapStore();

  useEffect(() => {
    setMapObjects(nodes);

    SCALABLE_REGIONS.forEach((region) => {
      setConvexHulls(region, new ConvexHull().setFromObject(nodes[region]));
    });
  }, [setMapObjects, nodes, setConvexHulls]);

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
            <meshStandardMaterial color="#5fd18f" />
          </primitive>
          <primitive object={nodes.au_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
          <primitive object={nodes.au_tas}>
            <meshStandardMaterial color="#5fd18f" />
          </primitive>
          <primitive object={nodes.au_tas_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="New Zealand">
          <primitive object={nodes.nz}>
            <meshStandardMaterial color="#555555" />
          </primitive>
          <primitive object={nodes.nz_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="Antartica">
          <primitive object={nodes.aq}>
            <meshStandardMaterial color="#D8ECF3" />
          </primitive>
          <primitive object={nodes.aq_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="North America">
          <primitive object={nodes.na}>
            <meshStandardMaterial color="#2A7E8C" />
          </primitive>
          <primitive object={nodes.na_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
        </group>
        <group name="South America">
          <primitive object={nodes.sa}>
            <meshStandardMaterial color="#4fa565" />
          </primitive>
          <primitive object={nodes.sa_base}>
            <meshStandardMaterial color="#d6c3a6" />
          </primitive>
        </group>
        {/* <primitive object={nodes.Spain}>
          <meshStandardMaterial color="#f7a46a" />
        </primitive>
        <primitive object={nodes.Spain_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Portugal}>
          <meshStandardMaterial color="#f3c58a" />
        </primitive>
        <primitive object={nodes.Portugal_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.France}>
          <meshStandardMaterial color="#9fa8ff" />
        </primitive>
        <primitive object={nodes.France_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Europe}>
          <meshStandardMaterial color="#4A7BBE" />
        </primitive>
        <primitive object={nodes.Europe_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.South_America}>
          <meshStandardMaterial color="#4fa565" />
        </primitive>
        <primitive object={nodes.South_America_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Africa}>
          <meshStandardMaterial color="#C89A3C" />
        </primitive>
        <primitive object={nodes.Africa_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive>
        <primitive object={nodes.Asia}>
          <meshStandardMaterial color="#C84A4A" />
        </primitive>
        <primitive object={nodes.Asia_base}>
          <meshStandardMaterial color="#d6c3a6" />
        </primitive> */}
      </RigidBody>
    </group>
  );
};

export default World;
