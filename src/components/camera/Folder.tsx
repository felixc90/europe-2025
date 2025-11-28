import { useEffect } from "react";
import data from "../../../public/data/data.json";
import { useCameraStore } from "../../stores/cameraStore";
const Folder = () => {
  const { route, setRoute, setPhotos, photos } = useCameraStore();
  const folder = route;

  useEffect(() => {
    const newPhotos =
      folder === "ALL_PHOTOS"
        ? data.items
            .map((item) =>
              item.images.map((image) => ({
                name: image,
                folder: item.name,
              }))
            )
            .reduce((a, b) => [...a, ...b])
        : (
            data.items.filter((item) => item.name == folder).at(0)?.images ?? []
          ).map((image) => ({ name: image, folder }));

    const updatePhotos = () => {
      setPhotos(newPhotos);
    };
    updatePhotos();
  }, [folder, setPhotos]);

  return (
    <div className="px-12 py-6  overflow-y-scroll">
      <div className="flex gap-4 mb-8">
        <div className="text-[#959795] my-auto">{folder}</div>
      </div>
      <div className="flex flex-wrap gap-10">
        {photos.map((photo, i) => (
          <div
            className="w-30 cursor-pointer"
            key={i}
            onClick={() => {
              setRoute(`${route}/${i}`);
            }}
          >
            <img
              src={`/data/images/${photo.folder}/${photo.name}`}
              alt={`Photo from ${photo.folder}`}
            />
            <div className="text-[16px] mt-3">{photo.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folder;
