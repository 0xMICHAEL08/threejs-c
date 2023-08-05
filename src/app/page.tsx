import Image from "next/image";
import { Inter } from "next/font/google";
import * as THREE from 'three'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const scene = new THREE.Scene()
  return <div>123</div>;
}
