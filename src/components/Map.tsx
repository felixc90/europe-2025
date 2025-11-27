import { interactionGroups, RigidBody } from "@react-three/rapier";
import WaterMaterial from "../materials/WaterMaterial";
import { useGLTF } from "@react-three/drei";
import { CollisionGroup } from "../constants/CollisionGroup";
import Flag from "./Flag";
import * as THREE from "three";

const Map = () => {
  const { nodes } = useGLTF("models/world.glb");

  return (
    <group>
      <Flag
        spin={0}
        position={new THREE.Vector3(0, 0.5, 10)}
        texture="/textures/australia_flag.png"
      />
      <Flag
        spin={0}
        position={new THREE.Vector3(-8, 6, -6)}
        texture="/textures/france_flag.png"
      />
      <Flag
        spin={0}
        position={new THREE.Vector3(-3, -2, -12)}
        texture="/textures/spain_flag.png"
      />
      <Flag
        spin={-Math.PI / 2}
        position={new THREE.Vector3(7, -4, -10)}
        texture="/textures/portugal_flag.png"
      />
      <Flag
        spin={-Math.PI / 2}
        position={new THREE.Vector3(0, 10, 0)}
        texture="/textures/portugal_flag.png"
      />
      <Flag
        spin={-Math.PI / 2}
        position={new THREE.Vector3(0, -10, 0)}
        texture="/textures/portugal_flag.png"
      />
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
      </RigidBody>
    </group>
  );
};

export default Map;
