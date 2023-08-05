import * as THREE from "three";

export function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          if (material.map) material.map.dispose();
          if (material.lightMap) material.lightMap.dispose();
          if (material.bumpMap) material.bumpMap.dispose();
          if (material.normalMap) material.normalMap.dispose();
          if (material.specularMap) material.specularMap.dispose();
          if (material.envMap) material.envMap.dispose();

          material.dispose(); // disposes any programs associated with the material
        });
      } else {
        if (object.material.map) object.material.map.dispose();
        if (object.material.lightMap) object.material.lightMap.dispose();
        if (object.material.bumpMap) object.material.bumpMap.dispose();
        if (object.material.normalMap) object.material.normalMap.dispose();
        if (object.material.specularMap) object.material.specularMap.dispose();
        if (object.material.envMap) object.material.envMap.dispose();

        object.material.dispose(); // disposes any programs associated with the material
      }
    }
  });
}
