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

const UVCoordinates = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);
  const sizes = useWindowSize();

  const createTexture = (scene: THREE.Scene) => {
    // const geometry = new THREE.PlaneGeometry(200, 100);
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load("/earth.png");
    const material = new THREE.MeshLambertMaterial({
      map: texture,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    createPointLight(scene, new THREE.Vector3(1000, 0, 0), 3);
    createAmbient(scene, 0.03);

    console.log("uv", geometry.attributes.uv);

    return mesh;
  };

  const createCircle = (scene: THREE.Scene) => {
    const geometry = new THREE.CircleGeometry(60, 100);
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load("/earth.png");
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    createAmbient(scene, 0.03);
    scene.add(mesh);
  };

  const createTexArr = (scene: THREE.Scene) => {
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    // .load()方法加载图像，返回一个纹理对象Texture
    const texture = texLoader.load("/瓷砖.png");
    const material = new THREE.MeshLambertMaterial({
      // 设置纹理贴图：Texture对象作为材质map属性的属性值
      map: texture, //map表示材质的颜色贴图属性
    });
    const mesh = new THREE.Mesh(geometry, material);

    // 设置了纹理在x轴和y轴方向上的包装模式
    texture.wrapS = THREE.RepeatWrapping; // 该方向上纹理将被重复
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    mesh.rotateX(-Math.PI / 2);

    createAmbient(scene, 3);

    scene.add(mesh);
  };

  const createPngTexture = (scene: THREE.Scene) => {
    const geometry = new THREE.PlaneGeometry(60, 60);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/指南针.png");
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      // transparent: true, // 开启透明计算
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.position.y = 1;
    const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);

    texture.offset.x += 0.5;
    texture.wrapS = THREE.RepeatWrapping; // U方向包裹模式
    texture.repeat.x = 50;
    texture.offset.y += 0.5;
    texture.wrapT = THREE.RepeatWrapping; // V方向包裹模式
    texture.repeat.y = 50;

    scene.add(mesh, gridHelper);
    return texture;
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染对象 */
    // const mesh = createTexture(scene);
    // createCircle(scene);
    // createTexArr(scene);
    const texture = createPngTexture(scene);

    /* 创建渲染器 */
    const renderer = createRenderer(containerRef.current!);

    /* 创建坐标轴辅助 */
    createAxesHelper(scene, 5000);

    /* 创建OrbitControls */
    createOrbitControls(scene, camera, renderer);

    /* 创建渲染循环 */
    const render = createRenderLoop(
      renderer,
      scene,
      camera,
      animationFrameId,
      () => {
        texture.offset.x += 0.001;
        texture.offset.y += 0.001;
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
