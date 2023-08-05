"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js"; // 性能库
import { GUI } from "dat.gui";

import { disposeScene } from "../_components/dispose";

interface Sizes {
  width: number;
  height: number;
}

const BasicScene = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);
  const [pixelRatio, setPixelRatio] = useState(1); // 设置清晰度

  /* size */
  const sizes = useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  /* 光源 */
  const createLights = (scene: THREE.Scene) => {
    // 设置点光源
    const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0.1);
    pointLight.position.set(100, -50, 0);
    scene.add(pointLight);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
    scene.add(pointLightHelper);
    // 设置环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(ambient);
    // 设置平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-100, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    // directionalLight.target = cube1;
    scene.add(directionalLight);
    const dirLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5,
      0xff0000
    );
    scene.add(dirLightHelper);

    return { ambient, directionalLight };
  };

  /* GUI */
  const createGUI = (
    cube2: THREE.Mesh,
    ambient: THREE.Light,
    directionalLight: THREE.Light
  ) => {
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.right = "0px";
    gui.domElement.style.top = "50px";
    const obj = {
      color: 0x00ffff,
      x: 30,
      scale: 0,
      bool: false,
      pixel: 1,
    };
    const matFolder = gui.addFolder("材质");
    const lightFolder = gui.addFolder("光照");
    const dirLightFolder = lightFolder.addFolder("平行光");
    const posFolder = gui.addFolder("位置");
    matFolder.close();
    matFolder.addColor(obj, "color").onChange((value) => {
      (cube2.material as THREE.MeshBasicMaterial).color.set(value);
    });
    lightFolder.add(ambient, "intensity", 0, 2.0).name("环境光强度");
    dirLightFolder
      .add(directionalLight, "intensity", 0, 2.0)
      .name("平行光强度")
      .step(0.1);
    posFolder.add(obj, "x", -180, 180).onChange((value) => {
      cube2.position.x = value;
    });
    posFolder
      .add(obj, "scale", { left: -100, center: 0, right: 100 })
      .name("选择位置")
      .onChange((value) => {
        cube2.position.y = value;
      });
    posFolder
      .add(obj, "bool")
      .name("是否旋转")
      .onChange((value) => {
        console.log("obj.bool", value);
      });

    return { gui, obj };
  };

  /* 相机 */
  const createCamera = (sizes: Sizes): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    return camera;
  };

  /* 模型 */
  const create3DModels = (group: THREE.Group) => {
    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 20,
        specular: 0xffffff,
      })
    );
    group.add(cube1);
    const cube2 = new THREE.Mesh(
      new THREE.SphereGeometry(50),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true, // 开启透明
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    );
    cube2.position.x = -200;
    group.add(cube2);
    return { cube1, cube2 };
  };

  /* AxesHelper */
  const createAxesHelper = (scene: THREE.Scene, size: number) => {
    const axes = new THREE.AxesHelper(size);
    scene.add(axes);
  };

  /* 渲染器 */
  const createRenderer = (canvas: HTMLCanvasElement, pixelRatio: number) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, // 开启抗锯齿
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置canvas画布尺寸
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x444444, 1);
    return renderer;
  };

  /* 渲染动画 */
  const createRenderLoop = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    cube1: THREE.Mesh,
    obj: any
  ) => {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      stats.update();
      renderer.render(scene, camera);
      if (obj.bool) cube1.rotateY(0.01);
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
  const cleanup = (scene: THREE.Scene, gui: dat.GUI) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    disposeScene(scene);
    gui.destroy();
    window.onresize = null;
  };

  /* 重置画布尺寸 */
  const handleResize = (
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    pixelRatio: number
  ) => {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 保持aspect与原始比例一致
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setPixelRatio(pixelRatio);
    // 相机的属性(fov、aspect)改变时，需要更新投影矩阵，来重新确定相机的视野
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    /* 创建3D场景 */
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    /* 创建模型 */
    const { cube1, cube2 } = create3DModels(group);

    /* 创建光源 */
    const { ambient, directionalLight } = createLights(scene);

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染器 */
    const renderer = createRenderer(containerRef.current, pixelRatio);

    /* 创建GUI */
    const { gui, obj } = createGUI(cube2, ambient, directionalLight);

    /* 创建坐标轴辅助 */
    createAxesHelper(scene, 5000);

    /* 创建OrbitControls */
    createOrbitControls(scene, camera, renderer);

    /* 创建渲染循环 */
    const render = createRenderLoop(renderer, scene, camera, cube1, obj);
    render();

    /* 设置窗口大小改变时的处理函数 */
    window.onresize = () => handleResize(renderer, camera, pixelRatio);

    /* 返回清理函数 */
    return () => cleanup(scene, gui);
  }, [pixelRatio, sizes]);

  return (
    <div className=" relative">
      {/* 清晰度调整按钮 */}
      <div className=" absolute top-0 right-0 text-gray-50 flex space-x-2">
        <button
          onClick={() => {
            setPixelRatio(1);
          }}
        >
          标清
        </button>
        <button
          onClick={() => {
            setPixelRatio(2);
          }}
        >
          高清
        </button>
        <button
          onClick={() => {
            setPixelRatio(4);
          }}
        >
          超清
        </button>
      </div>
      <canvas ref={containerRef}></canvas>
    </div>
  );
};

export default BasicScene;
