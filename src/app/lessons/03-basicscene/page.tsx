"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const BasicScene = () => {
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
    camera.position.z = 4; // 将相机向后移动，threejs是右手坐标系
    camera.position.x = 1;
    camera.position.y = 1;
    scene.add(camera);

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    const animate = () => {
      requestAnimationFrame(animate); // 请求在下一帧时再次调用这个函数，即可无限循环
      renderer.render(scene, camera); // 渲染
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

export default BasicScene;
