import { useCameraStore } from "../stores/cameraStore";

export default function Interface() {
  const { active, setActive } = useCameraStore();

  const handleClick = () => {
    setActive(!active);
    console.log("Clicked!");
  };

  return (
    <div className="interface">
      <button onClick={handleClick}>TURN CAMERA {active ? "OFF" : "ON"}</button>
    </div>
  );
}
