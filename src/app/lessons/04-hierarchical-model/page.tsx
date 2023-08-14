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
} from "../_components/again";

const HierarchicalModel = () => {
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);
  const sizes = useWindowSize();

  const createGroup = (scene: THREE.Scene) => {
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    const group = new THREE.Group();
    const mesh1 = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry, material);
    // mesh1.add(mesh2);  // mesh和group的父类都是Object3D，继承相同的方法
    mesh2.translateX(25);
    group.add(mesh1, mesh2); // 旧版本中写作Object3D.add()
    console.log("查看group的子对象", group.children);
    console.log("查看scene的子对象", scene.children);
    // 子对象随着父对象(group)变换
    group.translateY(30);
    group.scale.set(4, 4, 4);
    group.rotateY(Math.PI / 6);

    // 模型命名
    group.name = "翻斗花园";
    mesh1.name = "一号楼";

    createPointLight(scene, new THREE.Vector3(100, 100, 100));

    scene.add(group);
  };

  const createBuilding = (scene: THREE.Scene) => {
    const group1 = new THREE.Group(); // 所有高层楼的父对象
    group1.name = "高层";
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(10, 60, 10);
      const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * 30;
      group1.add(mesh);
      mesh.name = "高层" + (i + 1) + "号楼";
    }
    group1.position.y = 30;

    const group2 = new THREE.Group();
    group2.name = "洋房";
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(10, 30, 10);
      const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * 30;
      group2.add(mesh);
      mesh.name = "洋房" + (i + 1) + "号楼";
    }
    group2.position.z = 50;
    group2.position.y = 15;

    const model = new THREE.Group();
    model.name = "翻斗花园";
    model.add(group1, group2);
    model.position.set(-50, 0, 25);

    // DFS遍历Threejs层级树模型
    model.traverse(function (obj) {
      console.log("所有模型节点的名称", obj.name); // DFS遍历
      if (obj instanceof THREE.Mesh) {
        obj.material.color.set(0xffff00);
      }
    });

    createDirectionalLight(scene, new THREE.Vector3(100, 100, 100));
    scene.add(model);

    // 查找某个具体的模型
    const nameNode = scene.getObjectByName("高层2号楼") as THREE.Mesh;
    (nameNode.material as THREE.MeshLambertMaterial).color.set(0xff0000);
  };

  const createPosition = (scene: THREE.Scene) => {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(50, 0, 0);
    const group = new THREE.Group();
    group.add(mesh);
    group.position.set(50, 0, 0);
    scene.add(group);

    // 获取世界坐标
    const worldPosition = new THREE.Vector3();
    mesh.getWorldPosition(worldPosition);
    console.log("世界坐标", worldPosition);
    console.log("局部坐标", mesh.position);

    // 改变几何体中所有顶点的位置，但不改变物体的中心点(区别于mesh.position.set(50 / 2, 0, 0);)
    geometry.translate(50 / 2, 0, 0);

    // mesh局部坐标系可视化
    const meshAxesHelper = new THREE.AxesHelper(100);
    group.add(meshAxesHelper);

    // 模型的显示/隐藏
    // mesh.material.visible = false;
    // group.visible = false;

    return { mesh };
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    /* 创建相机 */
    const camera = createCamera(sizes);

    /* 创建渲染对象 */
    // createGroup(scene);
    // createBuilding(scene);
    const { mesh } = createPosition(scene);

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
      () => mesh.rotateY(0.01)
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

export default HierarchicalModel;
