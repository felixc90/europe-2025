import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { Character } from "./Character";
import * as THREE from "three";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
    }
  );

  const [, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null);
  const character = useRef<THREE.Group>(null);
  const container = useRef<THREE.Group>(null);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());
  const characterRotationTarget = useRef(0);

  const [animation, setAnimation] = useState("idle");

  // https://www.youtube.com/watch?v=TicipSVT-T8
  // Movement
  useFrame(({ camera }) => {
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      const speed = get().run ? RUN_SPEED : WALK_SPEED;

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

    // Gravity
    rb.current?.applyImpulse(
      new THREE.Vector3()
        .copy(rb.current.translation())
        .negate()
        .normalize()
        .multiplyScalar(0.01),
      true
    );

    // Transform Up
    const gravityUp = new THREE.Vector3()
      .copy(rb.current.translation())
      .normalize();

    const currentRotation = rb.current.rotation();
    const currentQuat = new THREE.Quaternion(
      currentRotation.x,
      currentRotation.y,
      currentRotation.z,
      currentRotation.w
    );

    const localUp = new THREE.Vector3(0, 1, 0);
    localUp.applyQuaternion(currentRotation);

    const rotationQuat = new THREE.Quaternion().setFromUnitVectors(
      localUp,
      gravityUp
    );

    rotationQuat.multiply(currentQuat);
    rb.current.setRotation(rotationQuat, true);
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb} position={[50, 0, 0]}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={5} position-z={-2.5} />
        <group ref={character}>
          <Character scale={0.18} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};
