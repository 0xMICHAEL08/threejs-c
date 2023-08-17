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

const UVCoordinates = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);
  const sizes = useWindowSize();

  const createGLTFLoader = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    loader.load("/gltf/工厂.gltf", function (gltf) {
      console.log("控制台查看加载gltf文件返回的对象结构", gltf);
      console.log("gltf对象场景属性", gltf.scene.children);

      // 批量修改组内模型的颜色
      const nameNode = gltf.scene.getObjectByName("大货车");
      nameNode?.traverse(function (mesh) {
        if (mesh instanceof THREE.Mesh) {
          (mesh.material as THREE.MeshStandardMaterial).color.set(0xffff00);
        } else {
          console.warn("Mesh does not have a material:", mesh);
        }
      });

      // 共享材质问题
      const mesh1 = gltf.scene.getObjectByName("大货车1");

      const mesh2 = gltf.scene.getObjectByName("大货车2");

      scene.add(gltf.scene);
    });
    createAmbient(scene, 1);
  };

  const createRen = (scene: THREE.Scene) => {
    const texture = new THREE.TextureLoader().load("/earth.png");
    texture.colorSpace = THREE.SRGBColorSpace
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染对象 */
    // createGLTFLoader(scene);
    createRen(scene);

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

  return <canvas ref={containerRef}></canvas>;
};

export default UVCoordinates;
