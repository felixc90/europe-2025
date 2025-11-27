import { CameraState } from "../constants/CameraState";
import { useCameraStore } from "../stores/cameraStore";

const CameraUI = () => {
  const { boundingBox, cameraState } = useCameraStore();
  const BORDER_WIDTH = 8;
  if (cameraState != CameraState.ON || boundingBox == null) return <></>;

  const width = Math.floor(boundingBox.bottomRight.x - boundingBox.topLeft.x);
  const height = Math.floor(boundingBox.bottomRight.y - boundingBox.topLeft.y);
  return (
    <div
      style={{
        width: `${width - 2 * BORDER_WIDTH}px`,
        height: `${height - 2 * BORDER_WIDTH}px`,
        top: boundingBox.topLeft.y + BORDER_WIDTH,
        left: boundingBox.topLeft.x + BORDER_WIDTH,
      }}
      className="pointer-events-auto fixed rounded-xl bg-[#181818]"
    >
      <div className="text-2xl bg-white">This is a camera</div>
    </div>
  );
};

export default CameraUI;
