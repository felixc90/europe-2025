import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import { Character } from "./Character";
import * as THREE from "three";
import { COLLISION_GROUPS } from "../constants/CollisionGroups";
import { Airplane } from "./Airplane";
import type { UserData } from "../types/UserData";
import { lerpAngle, lerpVector } from "../utils/lerp";
import { alignToSphereNormal } from "../helpers/alignToSphereNormal";
import Camera from "./Camera";
import { useCameraStore } from "../stores/cameraStore";

export const CharacterController = () => {
  const { RUN_SPEED, ROTATION_SPEED, AIRPLANE_ALTITUDE, AIRPLANE_SPEED } =
    useControls("Character Control", {
      RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      AIRPLANE_ALTITUDE: { value: 12, min: 10, max: 20, step: 0.1 },
      AIRPLANE_SPEED: { value: 5, min: 1, max: 10, step: 0.1 },
    });

  const [, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null);
  const character = useRef<THREE.Group>(null);
  const container = useRef<THREE.Group>(null);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group>(null);
  const cameraPosition = useRef<THREE.Group>(null);
  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());
  const characterRotationTarget = useRef(0);
  const lightPosition = useRef<THREE.Group>(null);

  const [animation, setAnimation] = useState("idle");
  const [flying, setFlying] = useState(false); // 'character' or 'airplane'
  const { active } = useCameraStore();

  // https://www.youtube.com/watch?v=TicipSVT-T8
  // Movement
  useFrame(({ camera }) => {
    if (rb.current && !active) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      const speed = flying ? AIRPLANE_SPEED : RUN_SPEED;

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.z !== 0 || movement.x !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        const currentRotation = rb.current.rotation();
        const currentQuat = new THREE.Quaternion(
          currentRotation.x,
          currentRotation.y,
          currentRotation.z,
          currentRotation.w
        );

        const forward = new THREE.Vector3(0, 0, 1)
          .applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            characterRotationTarget.current + rotationTarget.current
          )
          .normalize()
          .multiplyScalar(speed)
          .applyQuaternion(currentQuat);

        vel.x = forward.x;
        vel.y = forward.y;
        vel.z = forward.z;

        if (speed === RUN_SPEED) {
          setAnimation("run");
        } else {
          setAnimation("walk");
        }
      } else {
        if (flying) {
          vel.x = lerp(vel.x, 0, 0.05);
          vel.y = lerp(vel.y, 0, 0.05);
          vel.z = lerp(vel.z, 0, 0.05);
        }
        setAnimation("idle");
      }
      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1
        );
      }

      rb.current.setLinvel(vel, true);
    }

    // CAMERA
    if (container.current && rb.current) {
      container.current.rotation.y = THREE.MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1
      );

      const currentRotation = rb.current.rotation();
      const currentQuat = new THREE.Quaternion(
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
        currentRotation.w
      );

      const characterUp = new THREE.Vector3(0, 1, 0);
      characterUp.applyQuaternion(currentQuat);

      camera.up.copy(characterUp);
      camera.updateProjectionMatrix();
    }

    if (cameraPosition.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);
    }

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  useFrame(() => {
    if (!rb.current) return;
    console.log(rb.current.translation());

    // Gravity
    const currentPos = rb.current.translation();

    if (flying) {
      const pos = rb.current.translation();
      const v = new THREE.Vector3(pos.x, pos.y, pos.z);
      const newPos = v.normalize().multiplyScalar(AIRPLANE_ALTITUDE);
      rb.current.setTranslation(
        lerpVector(new THREE.Vector3().copy(pos), newPos, 0.05),
        true
      );
    } else {
      rb.current.applyImpulse(
        new THREE.Vector3()
          .copy(currentPos)
          .negate()
          .normalize()
          .multiplyScalar(0.01),
        true
      );
    }

    const rotationQuat = alignToSphereNormal(
      rb.current.translation() as THREE.Vector3,
      Math.PI
    );
    rb.current.setRotation(rotationQuat, true);
  });

  useFrame(() => {
    if (!lightPosition.current) return;

    // Set the light at the fixed altitude in the same direction
    const fixedLightPos = cameraPosition.current?.position
      .normalize()
      .multiplyScalar(7.5);

    lightPosition.current.position.set(
      fixedLightPos?.x ?? 0,
      fixedLightPos?.y ?? 0,
      fixedLightPos?.z ?? 0
    );

    if (!cameraTarget.current || !cameraPosition.current) return;
    const lookAt = new THREE.Vector3().subVectors(
      cameraTarget.current.position,
      cameraPosition.current.position
    );

    // TODO: fix hard coded angle
    console.log(Math.atan(lookAt.y / lookAt.z));
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      position={[0, 0, 12]}
      collisionGroups={interactionGroups(
        [COLLISION_GROUPS.CHARACTER, COLLISION_GROUPS.AIRPLANE],
        [COLLISION_GROUPS.TERRAIN, COLLISION_GROUPS.WATER]
      )}
    >
      <group
        rotation={[0.9075144509356308, 0, 0]}
        position-y={-1.8}
        position-z={1.4}
      >
        <Camera />
      </group>
      <group ref={container}>
        <group ref={cameraTarget} position-z={0.5} />
        <group ref={cameraPosition} position-y={5} position-z={-3.5}>
          <group
            rotation={[0.9075144509356308, 0, 0]}
            position-y={-1.8}
            position-z={1.4}
          >
            <Camera />
          </group>
        </group>
        <group ref={lightPosition}>
          <pointLight intensity={100} />
        </group>
        <group ref={character}>
          <Airplane scale={0.18} position-y={-0.25} visible={flying} />
          <Character
            scale={0.18}
            position-y={-0.25}
            animation={animation}
            visible={!flying}
          />
        </group>
      </group>
      <CapsuleCollider
        args={[0.08, 0.15]}
        onCollisionEnter={({ other }) => {
          const userData = other.rigidBody?.userData as UserData;
          if (userData.type == COLLISION_GROUPS.WATER) {
            setFlying(true);
          }
          /* ... */
        }}
      />
    </RigidBody>
  );
};
