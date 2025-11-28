import data from "../../data/data.json";
import { useCameraStore } from "../../stores/cameraStore";

const Home = () => {
  const { setRoute } = useCameraStore();
  return (
    <div className="body px-12 py-6">
      <div className="text-[#959795] mb-8">SELECT FOLDER</div>
      <div className="flex flex-wrap gap-10">
        {data.items.map((item, i) => (
          <div key={i}>
            <div
              className="w-22 cursor-pointer"
              onClick={() => setRoute(item.name)}
            >
              <img src="/images/folder-3.png" alt="Pixelated Folder Icon" />
              <div className="text-sm mt-3">{item.name}</div>
            </div>
          </div>
        ))}
        <div>
          <div
            className="w-22 cursor-pointer"
            onClick={() => setRoute("ALL_PHOTOS")}
          >
            <img src="/images/folder-3.png" alt="Pixelated Folder Icon" />
            <div className="text-sm mt-3">VIEW_ALL_PHOTOS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
