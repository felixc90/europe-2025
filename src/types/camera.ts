import * as THREE from "three";

export interface BoundingBox {
  topLeft: THREE.Vector2;
  bottomRight: THREE.Vector2;
}

export interface Photo {
  folder: string;
  name: string;
}
