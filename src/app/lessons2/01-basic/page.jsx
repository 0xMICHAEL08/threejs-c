"use client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import Stats from "stats.js"; // 性能库
import { GUI } from "dat.gui";

import { disposeScene } from "@/app/_components/funcAgain";

const BasicScene = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);
  const [pixelRatio, setPixelRatio] = useState(1); // 设置清晰度

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    /* 创建3D场景 */
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
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
        transparent: "ture", // 开启透明
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    );
    cube2.position.x = -200;
    group.add(cube2);
    // 批量创建随机模型点位
    // const num = 2000;
    // for (let i = 0; i < num; i++) {
    //   const geometry = new THREE.BoxGeometry(5, 5, 5);
    //   const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    //   const mesh = new THREE.Mesh(geometry, material);
    //   const x = (Math.random() - 0.5) * 1000;
    //   const y = (Math.random() - 0.5) * 1000;
    //   const z = (Math.random() - 0.5) * 1000;
    //   mesh.position.set(x, y, z);
    //   scene.add(mesh);
    // }
    // 在XOZ平面上生成阵列
    // const geometry = new THREE.BoxGeometry(100, 100, 100);
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x00ffff,
    //   transparent: true,
    //   opacity: 0.5,
    // });
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < 10; j++) {
    //     const mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.set(i * 200, 0, j * 200);
    //     scene.add(mesh);
    //   }
    // }

    /* 渲染视窗 */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // onresize 事件会在窗口被调整大小时发生
    window.onresize = () => {
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

    /* 光源 */
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
    const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
    scene.add(dirLightHelper);

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);

    // AxesHelper坐标系
    const axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: containerRef.current,
      antialias: true, // 开启抗锯齿
    });
    // renderer.setClearColor(0xffffff, 1); // 设置清除颜色和透明度
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置canvas画布尺寸
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x444444, 1);

    // 设置gui
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
      cube2.material.color.set(value);
    });
    lightFolder.add(ambient, "intensity", 0, 2.0).name("环境光强度");
    dirLightFolder.add(directionalLight, "intensity", 0, 2.0).name("平行光强度").step(0.1);
    posFolder.add(obj, "x", -180, 180).onChange((value) => {
      cube2.position.x = value;
    });
    posFolder
      // .add(obj, "scale", [-100, 0, 100]) // 数组/对象，生成交互界面是下拉菜单
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

    // 渲染
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      stats.update();
      renderer.render(scene, camera);
      if (obj.bool) cube1.rotateY(0.01);
      animationFrameId.current = requestAnimationFrame(render);
    }
    render();

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => {
      renderer.render(scene, camera);
    });

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      disposeScene(scene);
      gui.destroy();
      window.onresize = null;
    };
  }, [containerRef.current, pixelRatio]);

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
