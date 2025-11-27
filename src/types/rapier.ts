import { CollisionGroup } from "../constants/CollisionGroup";

export type RotationLike = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type VectorLike = {
  x: number;
  y: number;
  z: number;
};

export interface UserData {
  type: (typeof CollisionGroup)[keyof typeof CollisionGroup];
}
