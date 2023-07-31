"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const TransformObjects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    /* Scene */
    const scene = new THREE.Scene();

    /* Objects */
    const group = new THREE.Group();
    group.position.y = 1;
    group.scale.y = 2;
    group.rotation.y = 1;
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    cube2.position.x = -2;
    group.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    cube3.position.x = 2;
    group.add(cube3);

    // Scale
    // mesh.scale.x = 2;
    // mesh.scale.y = 0.5;
    // mesh.scale.z = 0.5;
    // mesh.scale.set(2, 0.5, 0.5);

    // Rotation
    // mesh.rotation.order = "YXZ"; // 指定旋转顺序
    // mesh.rotation.x = Math.PI * 0.25;
    // mesh.rotation.y = Math.PI * 0.25;
    // mesh.rotation.z = Math.PI * 0.25;

    // Position
    // mesh.position.x = 0.7;
    // mesh.position.y = -0.6;
    // mesh.position.z = 1;
    // mesh.position.set(0.7, -0.6, 1);

    // Normalize，将mesh.position归一化，即指向原来方向，但距离原点的距离为1
    // mesh.position.normalize();
    // console.log(mesh.position.length()); // sqrt(x*x + y*y + z*z)
    // console.log(mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)));
    // console.log(mesh.position.length()); // 1

    // Axes helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    /* Sizes */
    const sizes = {
      width: 800,
      height: 600,
    };

    /* Camera */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    // camera.position.y = 1;
    // camera.position.x = 1;
    scene.add(camera);
    // camera.lookAt(mesh.position); // 相机对准物体

    // console.log(mesh.position.distanceTo(camera.position)); // mesh到相机的距离

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
      group.children.forEach((child: any) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          child.material.dispose();
        }
      });
      scene.remove(group);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="webgl"></canvas>
    </div>
  );
};

export default TransformObjects;
