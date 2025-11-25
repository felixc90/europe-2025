import { COLLISION_GROUPS } from "../constants/CollisionGroups";
export interface UserData {
  type: (typeof COLLISION_GROUPS)[keyof typeof COLLISION_GROUPS];
}
