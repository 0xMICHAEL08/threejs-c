import React, { useEffect, useMemo, useState } from "react";
import { Sizes } from "@/app/type";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { disposeScene } from "./dispose";
import Stats from "stats.js"; // 性能库

export const useWindowSize = () => {
  return useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );
};

export const createCamera = (sizes: Sizes): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.set(200, 200, 200);
  camera.lookAt(100, 0, 0); // 不生效，相机被Orbit接管
  return camera;
};

export const createAxesHelper = (scene: THREE.Scene, size: number) => {
  const axes = new THREE.AxesHelper(size);
  scene.add(axes);
};

export const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x444444, 1);
  return renderer;
};

export const createOrbitControls = (
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
  return controls;
};

export const cleanup = (
  scene: THREE.Scene,
  animationFrameId: React.MutableRefObject<number | null>,
  handleResize: () => void
) => {
  if (animationFrameId.current) {
    cancelAnimationFrame(animationFrameId.current);
  }
  disposeScene(scene);
  if (window.onresize === handleResize) {
    window.onresize = null;
  }
};

export const handleResize = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createRenderLoop = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  animationFrameId: React.MutableRefObject<number | null>,
  onFrameUpdate?: () => void
) => {
  const stats = new Stats();
  document.body.appendChild(stats.domElement);
  function render() {
    stats.update();
    onFrameUpdate ? onFrameUpdate() : null;
    renderer.render(scene, camera);
    animationFrameId.current = requestAnimationFrame(render);
  }
  return render;
};

export const createPointLight = (
  scene: THREE.Scene,
  position: THREE.Vector3,
  intensity: number = 2,
  distance: number = 0,
  decay: number = 0.05
) => {
  const pointLight = new THREE.PointLight(0xffffff, intensity, distance, decay);
  pointLight.position.copy(position);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  scene.add(pointLight, pointLightHelper);
};

export const createDirectionalLight = (
  scene: THREE.Scene,
  position: THREE.Vector3,
  target?: THREE.Object3D
) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.copy(position);
  directionalLight.target = target || new THREE.Object3D();
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    3,
    0xffffff
  );
  scene.add(directionalLight, directionalLightHelper);
};

export const createAmbient = (scene: THREE.Scene, intensity: number = 0.05) => {
  const ambient = new THREE.AmbientLight(0xffffff, intensity);
  scene.add(ambient);
};
