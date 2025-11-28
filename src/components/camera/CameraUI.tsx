import { CameraState } from "../../constants/CameraState";
import { useCameraStore } from "../../stores/cameraStore";
import Header from "./Header";
import Home from "./Home";
import Folder from "./Folder";
import PhotoViewer from "./PhotoViewer";

const CameraUI = () => {
  const { boundingBox, cameraState, route } = useCameraStore();
  const BORDER_WIDTH = 8;

  if (cameraState != CameraState.ON || boundingBox == null) return <></>;
  const width = Math.floor(boundingBox.bottomRight.x - boundingBox.topLeft.x);
  const height = Math.floor(boundingBox.bottomRight.y - boundingBox.topLeft.y);

  const path = route.split("/").filter((value) => value.length !== 0);

  return (
    <div
      style={{
        width: `${width - 2 * BORDER_WIDTH}px`,
        height: `${height - 2 * BORDER_WIDTH}px`,
        top: boundingBox.topLeft.y + BORDER_WIDTH,
        left: boundingBox.topLeft.x + BORDER_WIDTH,
        fontFamily: "NeueBit",
      }}
      className="pointer-events-auto fixed rounded-xl bg-[#181818] text-[#e3e5e4] text-2xl flex flex-col"
    >
      <Header />
      <div className="flex-1 overflow-y-scroll">
        {path.length == 0 ? (
          <Home />
        ) : path.length == 1 ? (
          <Folder />
        ) : (
          <PhotoViewer />
        )}
      </div>
    </div>
  );
};

export default CameraUI;
