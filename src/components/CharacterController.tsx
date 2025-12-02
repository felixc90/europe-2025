import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  interactionGroups,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import {
  clamp,
  degToRad,
  inverseLerp,
  lerp,
} from "three/src/math/MathUtils.js";
import { Character } from "./Character";
import * as THREE from "three";
import { CollisionGroup } from "../constants/CollisionGroup";
import { Airplane } from "./Airplane";
import type { UserData } from "../types/rapier";
import { lerpAngle, lerpVector } from "../utils/lerp";
import { alignToSphereNormal } from "../helpers/alignToSphereNormal";
import Camera from "./Camera";
import { useCameraStore } from "../stores/cameraStore";
import { CameraState } from "../constants/CameraState";
import { toVector3 } from "../helpers/toVector3";
import { toQuaternion } from "../helpers/toQuaternion";
import { useCharacterStore } from "../stores/characterStore";
import { SPHERE_RADIUS } from "../constants/Sphere";
import { useMapStore } from "../stores/mapStore";
import {
  MAX_CAMERA_POSITION,
  MAX_CAPSULE_HALF_HEIGHT,
  MAX_CAPSULE_RADIUS,
  MAX_DISTANCE,
  MAX_SCALE,
  MIN_CAMERA_POSITION,
  MIN_CAPSULE_HALF_HEIGHT,
  MIN_CAPSULE_RADIUS,
  MIN_DISTANCE,
  MIN_SCALE,
  SCALABLE_REGIONS,
} from "../constants/Scale";

export const CharacterController = () => {
  const {
    RUN_SPEED,
    ROTATION_SPEED,
    AIRPLANE_ALTITUDE,
    AIRPLANE_SPEED,
    USE_CAMERA,
  } = useControls("Character Control", {
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    AIRPLANE_ALTITUDE: {
      value: SPHERE_RADIUS * 1.25,
      min: SPHERE_RADIUS,
      max: SPHERE_RADIUS * 4,
      step: 2,
    },
    AIRPLANE_SPEED: { value: 5, min: 1, max: 10, step: 0.1 },
    USE_CAMERA: true,
  });

  const [, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null);
  const collider = useRef<RapierCollider>(null);
  const character = useRef<THREE.Group>(null);
  const container = useRef<THREE.Group>(null);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group>(null);
  const cameraPosition = useRef<THREE.Group>(null);
  const cameraRotation = useRef<THREE.Group>(null);
  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const characterRotationTarget = useRef(0);
  const lightPosition = useRef<THREE.Group>(null);

  const [animation, setAnimation] = useState("idle");
  const { cameraState } = useCameraStore();
  const { isFlying } = useCharacterStore();
  const { convexHulls } = useMapStore();

  // https://www.youtube.com/watch?v=TicipSVT-T8
  // Update movement
  useFrame(({ camera }) => {
    if (!rb.current) return;
    // console.log(
    //   rb.current.translation().x,
    //   rb.current.translation().y,
    //   rb.current.translation().z
    // );
    if (cameraState == CameraState.OFF) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      const speed = isFlying ? AIRPLANE_SPEED : RUN_SPEED;

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
        if (isFlying) {
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
    } else {
      rb.current.setLinvel(new THREE.Vector3(0, 0, 0), true);
    }

    // CAMERA
    if (container.current) {
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

    if (cameraPosition.current && USE_CAMERA) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      console.log(cameraPosition.current.position);
      camera.position.lerp(cameraWorldPosition.current, 0.1);
    }

    if (cameraTarget.current && USE_CAMERA) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  // Update gravity
  useFrame(() => {
    if (!rb.current) return;

    const currentPos = rb.current.translation();

    if (isFlying) {
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
      toVector3(rb.current.translation()),
      toQuaternion(rb.current.rotation())
    );
    rb.current.setRotation(rotationQuat, true);
  });

  // Update light position
  useFrame(() => {
    return;
    if (!lightPosition.current) return;

    // Set the light at the fixed altitude in the same direction
    // const fixedLightPos = cameraPosition.current?.position
    //   .normalize()
    //   .multiplyScalar(7.5);

    // lightPosition.current.position.set(
    //   fixedLightPos?.x ?? 0,
    //   fixedLightPos?.y ?? 0,
    //   fixedLightPos?.z ?? 0
    // );
  });

  // Update character rotation
  useFrame(() => {
    if (!cameraTarget.current || !cameraPosition.current) return;
    const lookAt = new THREE.Vector3().subVectors(
      cameraTarget.current.position,
      cameraPosition.current.position
    );
    if (cameraRotation.current) {
      cameraRotation.current?.rotation.set(
        -Math.atan(lookAt.y / lookAt.z),
        0,
        0
      );
    }
  });

  // Update character scale
  useFrame(() => {
    const dist = SCALABLE_REGIONS.map((region) => {
      if (!rb || rb.current == null) return Number.POSITIVE_INFINITY;
      const position = rb.current.translation();
      return convexHulls[region].vertices
        .map((v) => Math.abs(v.point.distanceTo(toVector3(position))))
        .reduce((prevValue, currValue) => Math.min(prevValue, currValue));
    }).reduce((prevValue, currValue) => Math.min(prevValue, currValue));
    console.log(dist);

    const value = clamp(dist, MIN_DISTANCE, MAX_DISTANCE);
    const t = inverseLerp(MIN_DISTANCE, MAX_DISTANCE, value);
    if (character.current) {
      character.current.scale.set(
        ...lerpVector(MIN_SCALE, MAX_SCALE, t).toArray()
      );
    }

    if (collider.current) {
      collider.current.setHalfHeight(
        lerp(MIN_CAPSULE_HALF_HEIGHT, MAX_CAPSULE_HALF_HEIGHT, t)
      );
      collider.current.setRadius(
        lerp(MIN_CAPSULE_RADIUS, MAX_CAPSULE_RADIUS, t)
      );
    }

    if (cameraPosition.current) {
      cameraPosition.current.position.set(
        ...lerpVector(MIN_CAMERA_POSITION, MAX_CAMERA_POSITION, t).toArray()
      );
      console.log(cameraPosition.current.position);
    }
    // if (cameraTarget.current) {
    //   cameraTarget.current.position.set(
    //     ...lerpVector(MIN_CAMERA_TARGET, MAX_CAMERA_TARGET, t).toArray()
    //   );
    //   console.log(cameraTarget.current.position);
    // }
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      rotation={[0, 0.7236, 0]}
      position={[-18, -12, -14]}
      collisionGroups={interactionGroups(
        [CollisionGroup.CHARACTER, CollisionGroup.AIRPLANE],
        [CollisionGroup.TERRAIN, CollisionGroup.WATER]
      )}
    >
      <group ref={container}>
        {/* <group ref={cameraTarget} position-z={0.5} /> */}
        <group ref={cameraTarget} position-z={0} />
        <group ref={cameraPosition} position={[0, 5, -3.5]}>
          <group
            ref={cameraRotation}
            rotation={[0.9, 0, 0]}
            position-y={-1.8}
            position-z={1.25}
          >
            <Camera />
          </group>
        </group>
        <group position-y={0.1}>
          <pointLight intensity={3} distance={15} />
        </group>
        <group ref={character}>
          <Airplane scale={0.18} position-y={-0.25} visible={isFlying} />
          <Character
            rotation={[0, 0, 0]}
            scale={0.18}
            position-y={-0.25}
            animation={animation}
            visible={!isFlying}
          />
        </group>
      </group>
      <CapsuleCollider
        ref={collider}
        args={[0.08, 0.15]}
        onCollisionEnter={({ other }) => {
          const userData = other.rigidBody?.userData as UserData;
          if (userData.type == CollisionGroup.WATER) {
            // setFlying(true);
          }
          /* ... */
        }}
      />
    </RigidBody>
  );
};
