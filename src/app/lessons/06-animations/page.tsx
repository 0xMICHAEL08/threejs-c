"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const Animations = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    /* Scene */
    const scene = new THREE.Scene();

    /* Red Cube */
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "#ff0000",
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /* Sizes */
    const sizes = {
      width: 800,
      height: 600,
    };

    /* Camera */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);

    // Clock
    const clock = new THREE.Clock();

    // gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
    // gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

    /* Animations */
    const animate = () => {
      // Updata objects
      const elapsedTime = clock.getElapsedTime();
      // 均匀旋转
      // mesh.rotation.x = elapsedTime
      // 开始到现在，物体应该旋转的弧度数，即每秒一圈;Math.PI * 2在弧度中表示一圈
      // mesh.rotation.x = elapsedTime * Math.PI * 2;
      // 设置物体在 y 轴上的位置为 Math.sin(elapsedTime) 的值
      mesh.position.y = Math.sin(elapsedTime);
      mesh.position.x = Math.cos(elapsedTime);
      camera.lookAt(mesh.position);

      /* 
      数学推导：
        f：帧率(计算机每秒渲染的帧数)；d：总移动像素；T：移动总时间；deltaTime：两帧之间的时间差
        T秒内的帧数F = T*f
        f = 1 / 每帧持续的秒数 = 1 / (deltaTime/1000) = 1000/deltaTime
        F = T * (1000/deltaTime)
        于是，每帧移动的像素 = d/F = d / (T*(1000/deltaTime)) = (d*deltaTime)/(1000*T)
        综上可得，每帧移动的像素与deltaTime成正比，当deltaTime越大(即帧率越低)，每帧移动的像素应该越多，这样可以保证任意设备都有一样的效果
        所以0.001*deltaTime是为了平衡不同性能的设备
       */
      // mesh.rotation.x += 0.001 * deltaTime;
      // mesh.rotation.y += 0.001 * deltaTime;
      // mesh.rotation.z += 0.001 * deltaTime;

      // Render
      renderer.render(scene, camera); // 渲染
      requestAnimationFrame(animate); // 请求在下一帧时再次调用这个函数，即可无限循环
    };
    animate();

    return () => {
      // 清理资源，防止内存泄漏
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="webgl"></canvas>
    </div>
  );
};

export default Animations;
