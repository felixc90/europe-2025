import { CameraState } from "../constants/CameraState";
import { useCameraStore } from "../stores/cameraStore";
import { useCharacterStore } from "../stores/characterStore";
import CameraUI from "./camera/CameraUI";

export default function Interface() {
  const { cameraState, setCameraState } = useCameraStore();
  const { isFlying, setIsFlying } = useCharacterStore();

  const handleCameraClick = () => {
    if (cameraState == CameraState.OFF) {
      setCameraState(CameraState.TURNING_ON);
    } else if (cameraState == CameraState.ON) {
      setCameraState(CameraState.TURNING_OFF);
    }
  };

  const handleAirplaneClick = () => {
    setIsFlying(!isFlying);
  };

  return (
    <div className="interface">
      <button
        className="pointer-events-auto"
        onClick={handleCameraClick}
        disabled={
          cameraState == CameraState.TURNING_OFF ||
          cameraState == CameraState.TURNING_ON
        }
      >
        CAMERA
      </button>
      <button
        className="pointer-events-auto"
        disabled={cameraState == CameraState.ON}
        onClick={handleAirplaneClick}
      >
        {isFlying ? "WALK" : "FLY"}
      </button>
      <CameraUI />
    </div>
  );
}
