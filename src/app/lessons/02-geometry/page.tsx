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
  const createLineGeometry = (scene: THREE.Scene) => {
    const geometry = new THREE.BufferGeometry();
    //类型化数组创建顶点数据
    const vertices = new Float32Array([
      0,
      0,
      0, //顶点1坐标
      50,
      0,
      0, //顶点2坐标
      0,
      100,
      0, //顶点3坐标
      0,
      0,
      10, //顶点4坐标
      0,
      0,
      100, //顶点5坐标
      50,
      0,
      10, //顶点6坐标
    ]);
    /* BufferAttribute
      在WebGL（以及其他图形API）中，数据通常存储在缓冲区中，因为这样可以更高效地在GPU和CPU之间传输数据。
      这是因为GPU可以直接访问存储在缓冲区中的数据，而无需通过CPU进行中转，从而减少了数据传输的时间和开销。
      在这个例子中，vertices数组包含了几何体的所有顶点数据。
      通过创建一个BufferAttribute并将其赋值给geometry.attributes.position，我们将这些数据存储在了一个缓冲区中。
      这样，当我们需要在WebGL中渲染这个几何体时，GPU可以直接访问这些数据，从而提高渲染效率。
    */
    const attribute = new THREE.BufferAttribute(vertices, 3);
    geometry.attributes.position = attribute;
    const material = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 10.0, //点对象像素尺寸
    });
    const points = new THREE.Points(geometry, material); //点模型对象
    const material2 = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.LineLoop(geometry, material2); // connected in loops
    // const line = new THREE.LineSegments(geometry, material2); // connected in pairs
    scene.add(points, line);
  };

  const createRectangleGeometry = (scene: THREE.Scene) => {
    // A rectangular plane that can be formed by splicing at least 2 triangles
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,

      80, 0, 0,

      80, 80, 0,

      0, 80, 0,
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // store vertices

    const indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
    geometry.index = new THREE.BufferAttribute(indexes, 1); // store index

    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
    });

    // normals
    const normals = new Float32Array([
      0, 0, 1,

      0, 0, 1,

      0, 0, 1,

      0, 0, 1,
    ]);
    geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

    const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0.1);
    pointLight.position.set(10, 50, 50);
    scene.add(pointLight);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
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
    camera: THREE.Camera
  ) => {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      stats.update();
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
    createLineGeometry(scene);
    createRectangleGeometry(scene);
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      wireframe: true, //线条模式渲染mesh对应的三角形数据
    });
    geometry.scale(2, 2, 2);
    geometry.translate(50, 0, 0);
    geometry.rotateX(Math.PI / 4);
    geometry.center()
    scene.add(new THREE.Mesh(geometry, material));


    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染器 */
    const renderer = createRenderer(containerRef.current!);

    /* 创建坐标轴辅助 */
    createAxesHelper(scene, 5000);

    /* 创建OrbitControls */
    createOrbitControls(scene, camera, renderer);

    /* 创建渲染循环 */
    const render = createRenderLoop(renderer, scene, camera);
    render();

    /* 设置窗口大小改变时的处理函数 */
    window.onresize = () => handleResize(renderer, camera);

    return () => cleanup(scene);
  }, []);

  return <canvas ref={containerRef}></canvas>;
};

export default BufferGeometry;
