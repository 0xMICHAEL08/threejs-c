"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  useWindowSize,
  createCamera,
  createAxesHelper,
  createRenderer,
  createOrbitControls,
  cleanup,
  handleResize,
  createRenderLoop,
  createPointLight,
  createDirectionalLight,
  createAmbient,
} from "../_components/again";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Spline from "@splinetool/react-spline";

const UVCoordinates = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);
  const sizes = useWindowSize();

  const createMetal = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    const names = ["Sphere", "Shape"];
    loader.load("/gltf/hello.gltf", (gltf) => {
      gltf.scene.traverse((object) => {
        if (object instanceof THREE.Mesh && names.includes(object.name)) {
          object.material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0,
            roughness: 0.3,
          });
        }
      });
      gltf.scene.scale.set(20, 20, 20);
      console.log(gltf.scene);

      scene.add(gltf.scene);
    });

    createDirectionalLight(scene, new THREE.Vector3(100, 100, 100));
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染对象 */
    createMetal(scene);

    /* 创建渲染器 */
    const renderer = createRenderer(containerRef.current!);

    /* 创建坐标轴辅助 */
    createAxesHelper(scene, 5000);

    /* 创建OrbitControls */
    const controls = createOrbitControls(scene, camera, renderer);

    /* 创建渲染循环 */
    const render = createRenderLoop(
      renderer,
      scene,
      camera,
      animationFrameId,
      () => {
        // console.log("controls.target", controls.target);
      }
    );
    render();

    // /* 设置窗口大小改变时的处理函数 */
    const handleResizeWithArgs = () => {
      handleResize(renderer, camera);
    };
    window.onresize = handleResizeWithArgs;

    return () => cleanup(scene, animationFrameId, handleResizeWithArgs);
  }, []);

  return (
    <canvas ref={containerRef}>
      <Spline scene="https://prod.spline.design/MyPA6qgo5bHqKsoW/scene.splinecode" />
    </canvas>
  );
};

export default UVCoordinates;
