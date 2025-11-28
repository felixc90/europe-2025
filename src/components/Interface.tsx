import { CameraState } from "../constants/CameraState";
import { useCameraStore } from "../stores/cameraStore";
import CameraUI from "./camera/CameraUI";

export default function Interface() {
  const { cameraState, setCameraState } = useCameraStore();

  const handleClick = () => {
    if (cameraState == CameraState.OFF) {
      setCameraState(CameraState.TURNING_ON);
    } else if (cameraState == CameraState.ON) {
      setCameraState(CameraState.TURNING_OFF);
    }
    console.log("Clicked!");
  };

  return (
    <div className="interface">
      <button
        className="pointer-events-auto"
        onClick={handleClick}
        disabled={
          cameraState == CameraState.TURNING_OFF ||
          cameraState == CameraState.TURNING_ON
        }
      >
        CAMERA
      </button>
      <CameraUI />
    </div>
  );
}
