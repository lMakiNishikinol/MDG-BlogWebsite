"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import FallingText from "@/components/reactbits/FallingText";
import DateScheduleCalendar from "@/components/about/DateScheduleCalendar";

export default function AboutPage() {
  const [animate, setAnimate] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 300);

    // Set isClient to true once component mounts (client-side only)
    setIsClient(true);

    // Detect touch/mobile device
    setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  return (
    <div className="min-h-screen w-full pt-20 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translate3d(0, 10px, 0); }
            to { opacity: 1; transform: translate3d(0, 0, 0); }
          }
          @keyframes floatUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes rotateIn {
            0% { transform: rotate(-5deg) scale(0.95); opacity: 0; }
            100% { transform: rotate(0) scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes ledBlink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
          @keyframes dataFlow {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes snowfall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(20px) rotate(360deg); }
          }
          @keyframes inkSpread {
            0% { transform: scale(0.95); opacity: 0.7; filter: blur(2px); }
            50% { transform: scale(1.02); opacity: 0.9; filter: blur(1px); }
            100% { transform: scale(1); opacity: 1; filter: blur(0); }
          }
          @keyframes inkDrop {
            0% { transform: scale(0); opacity: 0; }
            40% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.4; }
          }
          @keyframes inkStroke {
            0% { stroke-dashoffset: 1000; opacity: 0.3; }
            100% { stroke-dashoffset: 0; opacity: 0.7; }
          }
          @keyframes circuitBlink {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes circuitPulse {
            0% { stroke-width: 1; opacity: 0.7; }
            50% { stroke-width: 1.5; opacity: 1; }
            100% { stroke-width: 1; opacity: 0.7; }
          }
          @keyframes circuitFlow {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes bambooSway {
            0% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
            100% { transform: rotate(-1deg); }
          }
          @keyframes inkSplatter {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.4; }
          }
          .animate-float-up {
            animation: floatUp 0.8s ease-out forwards;
          }
          .animate-scale-in {
            animation: scaleIn 0.8s ease-out forwards;
          }
          .animate-rotate-in {
            animation: rotateIn 0.8s ease-out forwards;
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-led-blink {
            animation: ledBlink 2s ease-in-out infinite;
          }
          .animate-data-flow {
            stroke-dasharray: 4, 2;
            animation: dataFlow 2s linear infinite;
          }
          .animate-snowfall {
            animation: snowfall 10s linear infinite;
          }
          .animate-ink-spread {
            animation: inkSpread 3s ease-in-out infinite;
          }
          .animate-ink-drop {
            animation: inkDrop 2s ease-out forwards;
          }
          .animate-ink-stroke {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: inkStroke 2s ease-out forwards;
          }
          .animate-circuit {
            stroke-dasharray: 100;
            animation: circuitFlow 3s linear infinite;
          }
          .animate-circuit-blink {
            animation: circuitBlink 4s ease-in-out infinite;
          }
          .animate-circuit-pulse {
            animation: circuitPulse 3s ease-in-out infinite;
          }
          .animate-bamboo-sway {
            animation: bambooSway 5s ease-in-out infinite;
          }
          .animate-ink-splatter {
            animation: inkSplatter 2s ease-out forwards;
          }
          
          /* 粒子效果 - 水墨风格 */
          .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            mix-blend-mode: overlay;
            z-index: 1;
          }
          .particle:nth-child(1) {
            width: 35px;
            height: 35px;
            top: 15%;
            left: 12%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
            filter: blur(8px);
            animation: float 7s ease-in-out infinite;
          }
          .particle:nth-child(2) {
            width: 25px;
            height: 25px;
            top: 25%;
            right: 15%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
            filter: blur(6px);
            animation: float 8s ease-in-out infinite reverse;
          }
          .particle:nth-child(3) {
            width: 40px;
            height: 40px;
            bottom: 20%;
            right: 25%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
            filter: blur(10px);
            animation: float 9s ease-in-out infinite;
          }
          .particle:nth-child(4) {
            width: 30px;
            height: 30px;
            bottom: 30%;
            left: 20%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
            filter: blur(8px);
            animation: float 6s ease-in-out infinite reverse;
          }
          .particle:nth-child(5) {
            width: 20px;
            height: 20px;
            top: 40%;
            right: 10%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
            filter: blur(5px);
            animation: float 7s ease-in-out infinite;
          }
          .particle:nth-child(6) {
            width: 45px;
            height: 45px;
            top: 70%;
            left: 15%;
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
            filter: blur(12px);
            animation: float 8s ease-in-out infinite reverse;
          }
          
          /* 墨水滴落效果 */
          .ink-drop {
            position: absolute;
            transform-origin: center;
            z-index: 0;
          }
          .ink-drop:nth-child(1) {
            width: 250px;
            height: 250px;
            top: 5%;
            right: 2%;
            background-image: url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M125,10 C160,10 200,50 230,100 C240,150 200,220 125,230 C50,240 10,190 20,125 C30,60 90,10 125,10 Z' fill='rgba(20, 20, 20, 0.03)' /%3E%3C/svg%3E");
            animation-delay: 0.2s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .ink-drop:nth-child(2) {
            width: 200px;
            height: 200px;
            bottom: 10%;
            left: 5%;
            background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,20 C150,20 170,60 180,100 C190,140 170,170 110,180 C50,190 20,150 20,100 C20,50 50,20 100,20 Z' fill='rgba(20, 20, 20, 0.02)' /%3E%3C/svg%3E");
            animation-delay: 0.5s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .ink-drop:nth-child(3) {
            width: 300px;
            height: 300px;
            top: 40%;
            left: -5%;
            background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M150,30 C200,30 250,80 270,150 C280,220 250,260 150,270 C50,280 20,220 30,150 C40,80 100,30 150,30 Z' fill='rgba(20, 20, 20, 0.015)' /%3E%3C/svg%3E");
            animation-delay: 0.8s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          
          /* 山形墨滴效果 */
          .mountain-ink {
            position: absolute;
            transform-origin: center;
            z-index: 0;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .mountain-ink:nth-child(1) {
            width: 180px;
            height: 120px;
            bottom: 20%;
            right: 8%;
            background-image: url("data:image/svg+xml,%3Csvg width='180' height='120' viewBox='0 0 180 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,90 L30,60 L45,75 L60,30 L75,60 L90,20 L105,60 L120,40 L135,70 L150,50 L180,90 L180,120 L0,120 Z' fill='rgba(20, 20, 20, 0.02)' /%3E%3C/svg%3E");
            animation-delay: 0.3s;
          }
          .mountain-ink:nth-child(2) {
            width: 220px;
            height: 150px;
            top: 15%;
            left: 10%;
            background-image: url("data:image/svg+xml,%3Csvg width='220' height='150' viewBox='0 0 220 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,110 L40,70 L60,90 L80,40 L100,70 L120,20 L140,80 L160,50 L180,90 L220,110 L220,150 L0,150 Z' fill='rgba(20, 20, 20, 0.025)' /%3E%3C/svg%3E");
            animation-delay: 0.6s;
          }
          
          /* 墨迹笔触 */
          .ink-stroke {
            position: absolute;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            stroke: rgba(20, 20, 20, 0.1);
            fill: none;
            z-index: 0;
          }
          
          /* 墨迹溅落 */
          .ink-splatter {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: rgba(20, 20, 20, 0.2);
            filter: blur(2px);
            pointer-events: none;
            opacity: 0;
          }
          
          .snowflake {
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            filter: blur(1px);
            opacity: 0.7;
            pointer-events: none;
          }

          /* 移动端隐藏重度装饰元素 */
          @media (hover: none) and (pointer: coarse) {
            .ink-drop,
            .particle,
            .ink-stroke,
            .mountain-ink,
            .ink-splatter,
            .snowflake {
              display: none !important;
            }
          }
        `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        {/* Header section */}
        <div
          className={`text-center mb-10 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            {/* 左侧松树简笔元素 */}
            <div className="relative w-12 h-12 mr-6 hidden md:block">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-bamboo-sway"
                // 步骤2: 应用定义好的滤镜
                filter="url(#pine-shadow)"
              >
                {/* 步骤1: 在 <defs> 中定义滤镜 */}
                <defs>
                  <filter
                    id="pine-shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="2"
                      stdDeviation="2"
                      floodColor="#000"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                {/* 松树干 */}
                <rect
                  x="21"
                  y="32"
                  width="6"
                  height="12"
                  rx="1"
                  fill="#5A3D2B"
                />

                {/* 松树枝叶 - 三角形层叠效果 */}
                <path
                  d="M24,4 L36,18 H12 Z"
                  fill="#2A9D8F"
                  fillOpacity="0.9"
                  className="animate-circuit-pulse"
                />
                <path
                  d="M24,12 L38,24 H10 Z"
                  fill="#43AA8B"
                  fillOpacity="0.85"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M24,18 L40,32 H8 Z"
                  fill="#52B69A"
                  fillOpacity="0.8"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* 雪覆盖效果 - 树顶部 */}
                <path
                  d="M24,4 C20,6 18,9 17,11 C20,10 28,10 31,11 C30,9 28,6 24,4 Z"
                  fill="white"
                  fillOpacity="0.9"
                />

                {/* 雪覆盖效果 - 第二层 */}
                <path
                  d="M16,17 C19,16 29,16 32,17 C31,15 30,14 28,13 C23,14 20,14 16,13 Z"
                  fill="white"
                  fillOpacity="0.8"
                />

                {/* 雪覆盖效果 - 第三层 */}
                <path
                  d="M12,32 L15,28 C18,27 30,27 33,28 L36,32 Z"
                  fill="white"
                  fillOpacity="0.7"
                />

                {/* 松针效果 */}
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "1s" }}
                >
                  <line
                    x1="18"
                    y1="17"
                    x2="16"
                    y2="15"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="22"
                    y1="13"
                    x2="20"
                    y2="10"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="26"
                    y1="13"
                    x2="28"
                    y2="10"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="30"
                    y1="17"
                    x2="32"
                    y2="15"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                >
                  <line
                    x1="16"
                    y1="23"
                    x2="13"
                    y2="21"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="18"
                    y2="17"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="28"
                    y1="20"
                    x2="30"
                    y2="17"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="32"
                    y1="23"
                    x2="35"
                    y2="21"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "2s" }}
                >
                  <line
                    x1="12"
                    y1="30"
                    x2="9"
                    y2="28"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="17"
                    y1="28"
                    x2="14"
                    y2="25"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="31"
                    y1="28"
                    x2="34"
                    y2="25"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="36"
                    y1="30"
                    x2="39"
                    y2="28"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>

                {/* 点缀小点 - 松果效果 */}
                <circle
                  cx="21"
                  cy="15"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="27"
                  cy="15"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="19"
                  cy="22"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="29"
                  cy="22"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.2s" }}
                />
                <circle
                  cx="24"
                  cy="10"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />

                {/* 飘落的雪花 */}
                <circle cx="14" cy="8" r="0.8" fill="white" />
                <circle cx="32" cy="10" r="0.6" fill="white" />
                <circle cx="10" cy="20" r="0.7" fill="white" />
                <circle cx="37" cy="24" r="0.5" fill="white" />
                <circle cx="18" cy="6" r="0.6" fill="white" />
                <circle cx="30" cy="5" r="0.5" fill="white" />

                {/* 雪压弯曲效果 - 遮罩 */}
                <path
                  d="M34,20 C30,17 28,15 24,14 C20,15 18,17 14,20 C17,16 20,12 24,12 C28,12 31,16 34,20 Z"
                  fill="#43AA8B"
                  fillOpacity="0.7"
                />
              </svg>
            </div>

            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] dark:from-[#3A7D8A] dark:to-[#56CFE1] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              关于我们
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#3A7D8A] dark:text-[#56CFE1]">
                论文复现组
              </span>
            </h1>

            {/* 右侧雪云元素 */}
            <div className="relative w-16 h-12 ml-6 animate-float hidden md:block">
              <svg
                width="72"
                height="56"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                filter="url(#wind-shadow)"
              >
                <defs>
                  <filter
                    id="wind-shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="2"
                      stdDeviation="2"
                      floodColor="#000"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <path
                  d="M20,32 C12,32 8,26 8,20 C8,14 14,10 20,12 C22,6 30,6 34,10 C38,4 50,8 48,16 C54,18 56,28 50,32 C46,38 28,36 20,32 Z"
                  fill="url(#cloud-gradient)"
                  style={{ filter: "blur(1px)" }}
                />

                {/* 雪花 */}
                <circle
                  cx="20"
                  cy="22"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="30"
                  cy="16"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="40"
                  cy="22"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.8s" }}
                />

                <defs>
                  <linearGradient
                    id="cloud-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#808080" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
              探索人工智能前沿 · 复现经典论文 · 构建学术基础
            </p>
          </div>

          {/* 山脉剪影背景 */}
          <div className="absolute top-24 left-0 w-full overflow-hidden opacity-10 dark:opacity-20 pointer-events-none z-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <path
                d="M0,80 L60,70 L140,90 L200,60 L260,80 L320,40 L380,70 L440,50 L500,60 L560,30 L620,50 L680,20 L740,50 L800,10 L860,40 L920,30 L980,60 L1040,40 L1100,70 L1160,50 L1220,80 L1280,60 L1340,90 L1400,70 L1440,80 L1440,120 L0,120 Z"
                fill="#505050"
              />
              <path
                d="M0,100 L60,95 L120,105 L180,90 L240,100 L300,80 L360,95 L420,85 L480,90 L540,75 L600,85 L660,65 L720,85 L780,60 L840,80 L900,70 L960,90 L1020,75 L1080,95 L1140,85 L1200,100 L1260,90 L1320,105 L1380,95 L1440,100 L1440,120 L0,120 Z"
                fill="#606060"
              />
            </svg>
          </div>
        </div>

        {/* Main content */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 ${
            animate ? "animate-scale-in" : ""
          }`}
          style={{
            animationDelay: "0.3s",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(150, 150, 150, 0.1)",
          }}
        >
          {/* 水墨效果 - 新风格 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 墨点和墨痕 */}
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>

            {/* 电路板图案元素 */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 pointer-events-none"
            >
              {/* 电路轨道 */}
              <path
                d="M0,100 H300 M300,100 V250 M300,250 H150 M150,250 V350 M150,350 H400"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s", opacity: 0.2 }}
              />
              <path
                d="M0,300 H100 M100,300 V150 M100,150 H200 M200,150 V50 M200,50 H450"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1s", opacity: 0.2 }}
              />

              {/* CPU/芯片 装饰元素 */}
              <g transform="translate(400, 200)">
                <rect
                  x="-20"
                  y="-20"
                  width="40"
                  height="40"
                  stroke="#505050"
                  strokeWidth="1"
                  fill="none"
                  strokeOpacity="0.3"
                />
                <path
                  d="M-25,-10 H-30 M-25,0 H-30 M-25,10 H-30 M25,-10 H30 M25,0 H30 M25,10 H30 M-10,-25 V-30 M0,-25 V-30 M10,-25 V-30 M-10,25 V30 M0,25 V30 M10,25 V30"
                  stroke="#505050"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </g>

              <g transform="translate(100, 400)">
                <rect
                  x="-15"
                  y="-15"
                  width="30"
                  height="30"
                  stroke="#505050"
                  strokeWidth="1"
                  fill="none"
                  strokeOpacity="0.3"
                />
                <path
                  d="M-20,-7 H-25 M-20,0 H-25 M-20,7 H-25 M20,-7 H25 M20,0 H25 M20,7 H25 M-7,-20 V-25 M0,-20 V-25 M7,-20 V-25 M-7,20 V25 M0,20 V25 M7,20 V25"
                  stroke="#505050"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </g>

              {/* LED指示灯 */}
              <circle
                cx="300"
                cy="100"
                r="3"
                fill="#2A9D8F"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="150"
                cy="250"
                r="3"
                fill="#90BE6D"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="150"
                cy="350"
                r="3"
                fill="#43AA8B"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />

              {/* 墨笔触 */}
              <path
                d="M50,50 C100,20 200,80 300,40 C400,10 500,50 600,30"
                className="ink-stroke"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M10,200 C150,150 250,250 350,180 C450,120 550,180 650,150"
                className="ink-stroke"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M700,350 C600,300 500,400 400,350 C300,300 200,380 100,320"
                className="ink-stroke"
                style={{ animationDelay: "1.5s" }}
              />
            </svg>

            {/* 墨滴粒子 */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* 山形墨滴 */}
            <div className="mountain-ink"></div>
            <div className="mountain-ink"></div>

            {/* 墨迹溅落 */}
            {isClient && !isMobile &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`ink-splatter-${i}`}
                  className="ink-splatter animate-ink-splatter"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `scale(${0.5 + Math.random()})`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}

            {/* 雪花粒子 */}
            {isClient && !isMobile &&
              Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="snowflake"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.1 + Math.random() * 0.3,
                    animation: `snowfall ${
                      5 + Math.random() * 10
                    }s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
          </div>
          {/* 装饰性线条 */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>
          {/* Content sections */}
          <div className="relative z-10 mt-8">
            {/* 个人介绍 */}
            <div
              id="intro"
              className="space-y-6 animate-float-up mb-12 "
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* 头像 */}
                <div className="w-28 h-28 md:w-40 md:h-40 relative shrink-0">
                  <div className="cursor-target w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#56CFE1]/30">
                    <Image
                      src="/apple-touch-icon.png"
                      alt="论文复现组"
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>

                  {/* 水墨装饰 */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 opacity-20 pointer-events-none">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40,10 C50,10 60,20 70,40 C75,60 60,70 40,70 C20,70 5,60 10,40 C15,20 30,10 40,10 Z"
                        fill="#56CFE1"
                        fillOpacity="0.4"
                        className="animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="md:flex-1 w-full">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200 text-center md:text-left">
                    论文复现组
                  </h2>
                  <div className="cursor-target bg-gray-50 dark:bg-gray-700/40 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base">
                      组织简介
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                      论文复现组主要研读和复现人工智能领域的经典论文，一起讨论、交流学术内容，
                      也会适当地发散式探索人工智能领域其他技术，适合自学能力强、想打下人工智能研究基础的同学。
                    </p>
                  </div>
                  <div className="cursor-target bg-gray-50 dark:bg-gray-700/40 p-3 md:p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base">
                      研究内容
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-balance text-sm md:text-base">
                      论文复现组专注于深度学习、强化学习、计算机视觉等前沿领域，通过实践加深理论理解。
                      <br />
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-balance text-sm md:text-base">
                      我们欢迎任何人来旁听学习，即使你不在论文复现组
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-50 flex h-auto w-full md:w-[40rem] mx-auto md:ml-[-10%] items-center justify-center overflow-hidden rounded-lg py-8">
              <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-3xl md:text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                What We Learn
              </span>
            </div>
            <FallingText
              text={`DeepLearning ReinforcementLearning ComputerVision MachineLearning C Python Paper Algorithm`}
              highlightWords={["DeepLearning", "Paper"]}
              highlightClass="highlighted"
              trigger={isMobile ? "click" : "hover"}
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.56}
              fontSize={isMobile ? "1.2rem" : "2rem"}
              mouseConstraintStiffness={0.9}
            />
            {/* 技术成长 */}
            <div
              id="tech"
              className="animate-float-up mb-12"
              style={{ animationDelay: "0.1s" }}
            >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    学习路线
                  </h2>

                  {/* 第一学期 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#56CFE1] flex items-center justify-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                          <svg
                            viewBox="0 0 32 32"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                          >
                            <path
                              d="M0,24 L8,16 L12,20 L16,12 L20,18 L24,14 L32,24 L32,32 L0,32 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <path
                            d="M4,4 H20 V20 H4 V4 Z M4,8 H20 M8,8 V20"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        第一学期
                      </h3>
                    </div>

                    <div className="relative ml-4 pl-8 border-l-2 border-[#56CFE1]/30">
                      {[
                        {
                          week: "第7-8周",
                          title: "基础准备",
                          desc: "Python与深度学习",
                        },
                        {
                          week: "第9周",
                          title: "卷积神经网络",
                          desc: "VGG与MNIST",
                        },
                        {
                          week: "第10周",
                          title: "数据科学回归分析",
                          desc: "学习神经网络回归模型",
                        },
                        {
                          week: "第11-12周",
                          title: "\"残差\"与卷积",
                          desc: "学习Resnet及其变体、了解更多卷积",
                        },
                        {
                          week: "第13-16周",
                          title: "yolo家族",
                          desc: "yolo v1 - v8",
                        },
                        {
                          week: "寒假",
                          title: "强化学习基础",
                          desc: "pytorch与强化学习",
                        },
                      ].map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#56CFE1]"></div>
                          <span className="text-xs font-medium text-[#56CFE1]">
                            {item.week}
                          </span>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 学期分割线 */}
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3A7D8A] dark:via-[#56CFE1] to-transparent"></div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A3B4C]/10 to-[#45B7D1]/10 dark:from-[#3A7D8A]/10 dark:to-[#56CFE1]/10 rounded-full">
                      <span className="text-lg">✨</span>
                      <div className="text-center">
                        <span className="block text-xs text-gray-500 dark:text-gray-400">第一学期结束</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">第二学期开始</span>
                      </div>
                      <span className="text-lg">🚀</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#9D4EDD] to-transparent"></div>
                  </div>

                  {/* 第二学期 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#9D4EDD] flex items-center justify-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                          <svg
                            viewBox="0 0 32 32"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                          >
                            <path
                              d="M0,24 L8,16 L12,20 L16,12 L20,18 L24,14 L32,24 L32,32 L0,32 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <rect
                            x="6"
                            y="6"
                            width="12"
                            height="12"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M9,2 V6 M15,2 V6 M9,18 V22 M15,18 V22 M2,9 H6 M2,15 H6 M18,9 H22 M18,15 H22"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        第二学期
                      </h3>
                    </div>

                    <div className="relative ml-4 pl-8 border-l-2 border-[#9D4EDD]/30">
                      {[
                        {
                          week: "第1周",
                          title: "内容回顾",
                          desc: "深度学习与强化学习",
                        },
                        {
                          week: "第2-3周",
                          title: "强化学习算法",
                          desc: "经典且常用的算法",
                        },
                        {
                          week: "第4周",
                          title: "强化学习实践",
                          desc: "强化学习实践项目",
                        },
                        {
                          week: "第5-8周",
                          title: "大语言模型入门",
                          desc: "nlp与llm",
                        },
                      ].map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#9D4EDD]"></div>
                          <span className="text-xs font-medium text-[#9D4EDD]">
                            {item.week}
                          </span>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>

            <div
              id="date-schedule"
              className="animate-float-up mb-12"
              style={{ animationDelay: "0.15s" }}
            >
              <DateScheduleCalendar />
            </div>

            {/* 项目声明 */}
            <div
              id="thanks"
              className="animate-float-up mb-12"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                项目声明与致谢
              </h2>

              <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 dark:from-[#60A5FA]/5 dark:to-[#A78BFA]/5 p-6 rounded-xl border border-blue-200/50 dark:border-purple-500/30">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  本网站以{" "}
                  <a
                    href="https://github.com/wuyilin18/BlogWebsite-Eighteen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#56CFE1] dark:text-[#56CFE1] font-semibold hover:underline cursor-target"
                  >
                    BlogWebsite-Eighteen
                  </a>
                  {" "}为原型进行开发
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                  我们遵循 BlogWebsite-Eighteen 的所有开源协议与约束条款
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                  向开源作者的基础框架致谢🫡
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

