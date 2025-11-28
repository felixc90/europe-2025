import { useCameraStore } from "../../stores/cameraStore";

const PhotoViewer = () => {
  const { route, photos } = useCameraStore();
  const [folder, photoIdx] = route.split("/");
  if (!folder || !photoIdx || parseInt(photoIdx) > photos.length - 1) return;
  console.log(folder, photoIdx);

  const photo = photos[parseInt(photoIdx)];
  console.log(photos);
  return (
    <div className="px-6 py-3 justify-between h-full">
      <div className="flex min-h-0 gap-4 h-full">
        <img
          className="h-full"
          src={`/data/images/${photo.folder}/${photo.name}`}
          alt={`Photo from ${photo.folder}`}
        />
        <div className="w-[300px] border-l-neutral-600 border-l px-4">dsds</div>
      </div>
    </div>
  );
};

export default PhotoViewer;
