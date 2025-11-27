export const CollisionGroup = {
  DEFAULT: 0,
  CHARACTER: 1,
  TERRAIN: 2,
  WATER: 3,
  AIRPLANE: 4,
};

export type CollisionGroup =
  (typeof CollisionGroup)[keyof typeof CollisionGroup];
