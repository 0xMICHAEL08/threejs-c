"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js"; // 性能库
import { GUI } from "dat.gui";

import { disposeScene } from "../_components/dispose";
import { Sizes } from "@/app/type";

const BufferGeometry = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);

  /* size */
  const sizes = useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  /* 相机 */
  const createCamera = (sizes: Sizes): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    return camera;
  };

  /* create geometry */
  const createV3Object = (scene: THREE.Scene) => {
    const v3 = new THREE.Vector3(0, 0, 0);
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      wireframe: true, //线条模式渲染mesh对应的三角形数据
    });
    geometry.scale(2, 2, 2);
    geometry.translate(50, 0, 0);
    geometry.rotateX(Math.PI / 4);
    // geometry.center();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.5, 1.5, 2);
    console.log(".position:", mesh.position);

    scene.add(mesh);
  };
  const createEulerObject = (scene: THREE.Scene) => {
    const Euler = new THREE.Euler(Math.PI / 4, 0, Math.PI / 2);

    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    // 将Euler对象应用到立方体的旋转上
    mesh.rotation.copy(Euler);

    mesh.rotation.y = Math.PI / 3;
    // mesh.rotation.y += Math.PI / 3;

    // 绕某个轴旋转
    const axis = new THREE.Vector3(0, 1, 0);
    mesh.rotateOnAxis(axis, Math.PI / 8);

    console.log("material.color", material.color);

    // 颜色对象
    const color = new THREE.Color(0x00ff00);
    color.r = 1;
    color.setRGB(0, 1, 1);
    color.setHex(0x00ff00);
    color.setStyle("#00ff00");
    color.set("#00ff00");
    console.log("查看颜色对象结构：", color);

    // 模型材质
    material.transparent = true; // 开启透明
    material.opacity = 0.5; // 透明度
    // material.side = THREE.BackSide; // 背面可见
    // material.side = THREE.DoubleSide; // 双面可见
    console.log("material.side:", material.side);

    // 几何体属性
    console.log("mesh", mesh);
    console.log("mesh.geometry", mesh.geometry);
    console.log("mesh.material", mesh.material);
    // 访问模型材质，并设置材质的颜色属性
    mesh.material.color.set(0xffff00);
    // 访问模型几何体，并平移几何体顶点数据
    mesh.geometry.translate(0, 100, 0);

    // 克隆和复制
    const v1 = new THREE.Vector3(1, 2, 3);
    console.log("v1", v1);
    const v2 = v1.clone();
    console.log("v2", v2);
    const v3 = new THREE.Vector3(4, 5, 6);
    v3.copy(v1);
    console.log("v3", v3);
    // Mesh克隆
    const mesh2 = mesh.clone();
    mesh2.position.x = 100;
    // 由于mesh2克隆mesh，二者共用一套material，所以修改一个另一个也会变
    mesh2.material.color.set(0xffffff);
    mesh2.geometry = mesh.geometry.clone();
    mesh2.material = mesh.material.clone();
    mesh2.material.color.set(0xff0000); // 克隆几何体的材质，并重新设置

    /* 练习 */
    // 1. 改变mesh2位置，使之位于mesh2正上方，距离100
    mesh2.position.copy(mesh.position);
    mesh2.position.y += 100;
    // 2. 两个模型姿态角度始终保持一致(在render中修改)

    // 将立方体添加到场景中
    scene.add(mesh, mesh2);
    return { mesh, mesh2 };
  };

  /* AxesHelper */
  const createAxesHelper = (scene: THREE.Scene, size: number) => {
    const axes = new THREE.AxesHelper(size);
    scene.add(axes);
  };

  /* 渲染器 */
  const createRenderer = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, // 开启抗锯齿
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置canvas画布尺寸
    renderer.setClearColor(0x444444, 1);
    return renderer;
  };

  /* 渲染动画 */
  const createRenderLoop = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    mesh?: THREE.Mesh,
    mesh2?: THREE.Mesh
  ) => {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      stats.update();
      if (mesh) {
        mesh.rotateY(0.01);
        mesh2 ? mesh2.rotation.copy(mesh.rotation) : null;
      }
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(render);
    }
    return render;
  };

  /* OrbitControls */
  const createOrbitControls = (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
  ) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => {
      renderer.render(scene, camera);
    });
    return controls;
  };

  /* 清理函数 */
  const cleanup = (scene: THREE.Scene) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    disposeScene(scene);
    window.onresize = null;
  };

  /* 重置画布尺寸 */
  const handleResize = (
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
  ) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    // createPointGeometry(scene);
    // createV3Object(scene);
    const { mesh, mesh2 } = createEulerObject(scene);

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染器 */
    const renderer = createRenderer(containerRef.current!);

    /* 创建坐标轴辅助 */
    createAxesHelper(scene, 5000);

    /* 创建OrbitControls */
    createOrbitControls(scene, camera, renderer);

    /* 创建渲染循环 */
    const render = createRenderLoop(renderer, scene, camera, mesh, mesh2);
    render();

    /* 设置窗口大小改变时的处理函数 */
    window.onresize = () => handleResize(renderer, camera);

    return () => cleanup(scene);
  }, []);

  return <canvas ref={containerRef}></canvas>;
};

export default BufferGeometry;
