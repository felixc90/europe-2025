export const CameraState = {
  OFF: "OFF",
  TURNING_ON: "TURNING_ON",
  ON: "ON",
  TURNING_OFF: "TURNING_OFF",
} as const;

export type CameraState = (typeof CameraState)[keyof typeof CameraState];
