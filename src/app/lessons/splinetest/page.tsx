"use client";
import React from "react";
import Image from "next/image";
import Spline from "@splinetool/react-spline";
import Logo from "../../../../public/gltf/Spline/images/logo.svg";
import IconLaptop from "../../../../public/gltf/Spline/images/icon-laptop.svg";
import IconTwitter from "../../../../public/gltf/Spline/images/icon-twitter.svg";
import IconYoutube from "../../../../public/gltf/Spline/images/icon-youtube.svg";

const splineTest = () => {
  const navItems = ["Home", "Download", "App", "Login"];

  return (
    <div className=" relative font-spline text-base text-white w-full h-full">
      <div className=" pointer-events-none absolute top-8 z-10 my-0 mx-7 flex flex-col gap-10 lg:gap-20 lg:mt-8 lg:ml-24 ">
        {/* 菜单 */}
        <div className=" flex gap-7 items-center p-0 mx-0 pointer-events-auto justify-between">
          <li className=" list-none m-0 w-[36px] h-[50px]">
            <Image src={Logo} alt="logo" />
          </li>
          {navItems.map((item, index) => (
            <li
              className="list-none m-0 border border-solid border-[rgba(255,255,255,0)] transition duration-500 rounded-xl hover:border-[rgba(255,255,255,0.2)] hidden md:block"
              key={index}
            >
              <a
                href="http://localhost:3000/lessons/splinetest"
                className=" no-underline text-white py-2 px-5"
              >
                {item}
              </a>
            </li>
          ))}
          <li className="list-none m-0">
            <button className="myButton">Get Started</button>
          </li>
        </div>

        {/* 文本 */}
        <div className="user-select-none">
          <h1 className=" font-splinemono font-bold m-0 max-w-md text-3xl md:text-5xl mt-4 md:max-[400px] lg:text-6xl lg:max-[400px] xl:text-7xl xl:max-[500]">
            Collaborate with people
          </h1>
          <p className=" font-spline mt-4 font-normal leading-loose max-w-xs md:max-w-sm xl:max-w-md">
            Bring your team together and build your community by using our
            cross-platform app that lets you collaborate via chat, voice and by
            sharing and storing unlimited media files. A world of topics is
            waiting for you. Join the private beta.
          </p>
        </div>

        {/* 下载按钮 */}
        <button className=" myButton pointer-events-auto">
          <Image src={IconLaptop} alt="Download for Mac" />
          Download for Mac
        </button>
      </div>

      {/* Spline */}
      <div className=" absolute m-0 top-0 scale-[30%] right-0 sm:scale-50 md:scale-75 lg:scale-90 xl:scale-100 transform-origin-right">
        <Spline scene="https://prod.spline.design/MyPA6qgo5bHqKsoW/scene.splinecode" />
      </div>

      <div className=" absolute top-40 left-8 flex justify-center flex-col gap-7 items-center hidden lg:block">
        <a href="http://localhost:3000/lessons/splinetest">
          <Image src={IconTwitter} alt="Twitter" />
        </a>
        <div className=" w-[1px] h-[500px] bg-gradient-liner ml-auto mr-auto"></div>
        <a href="http://localhost:3000/lessons/splinetest">
          <Image src={IconYoutube} alt="Youtube" />
        </a>
      </div>
    </div>
  );
};

export default splineTest;
