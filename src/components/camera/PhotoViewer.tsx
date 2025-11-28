import { useEffect } from "react";
import { useCameraStore } from "../../stores/cameraStore";
import getExifFromUrl from "../../helpers/getExifFromUrl";

const PhotoViewer = () => {
  const { route, photos } = useCameraStore();
  const photoIdx = route.split("/")[1];
  const photo = photos[parseInt(photoIdx)];

  useEffect(() => {
    if (!photo) return;
    const loadData = async () => {
      const candidates = [photo.name + ".HEIC", photo.name + ".png"];
      for (const file of candidates) {
        try {
          const exifData = await getExifFromUrl(
            `/data/images/${photo.folder}/${file}`
          );
          return;
        } catch {}
      }
    };

    loadData();
  }, [photo]);

  return (
    <div className="px-6 py-3 justify-between h-full">
      <div className="flex min-h-0 gap-4 h-full">
        <img
          className="h-full"
          src={`/data/images/${photo.folder}/${photo.name}.png`}
          alt={`Photo from ${photo.folder}`}
        />
        <div className="w-[300px] border-l-neutral-600 border-l px-4">
          EXIF DATA
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
