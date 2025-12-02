import Flag from "./Flag";
import * as THREE from "three";
import World from "./World";

const Map = () => {
  return (
    <group>
      <group name="flags">
        <Flag
          spin={0.5}
          position={new THREE.Vector3(-16, -10, -16)}
          texture="/textures/australia_flag.png"
        />
        <Flag
          spin={0}
          position={new THREE.Vector3(21, 15, 1)}
          texture="/textures/france_flag.png"
        />
        <Flag
          spin={0}
          position={new THREE.Vector3(24, 8, 5)}
          texture="/textures/spain_flag.png"
        />
        <Flag
          spin={0}
          position={new THREE.Vector3(22, 6, 11)}
          texture="/textures/portugal_flag.png"
        />
      </group>
      <World />
    </group>
  );
};

export default Map;
