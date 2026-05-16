import { TextAnimate } from "@/components/magicui/text-animate";
import { ParallaxSection } from "@/components/Home/ParallaxSkeleton/ParallaxSection";
import { BoxReveal } from "@/components/magicui/box-reveal";
import CardContainer from "@/components/Home/3DCardEffect/CardContainer";
import CardBody from "@/components/Home/3DCardEffect/CardBody";
import CardItem from "@/components/Home/3DCardEffect/CardItem";
import Image from "next/image";
import React from "react";
import { ORBIT_DIRECTION } from "@/components/Home/Orbit/types";
import Orbit from "@/components/Home/Orbit/Orbit";
import { WordRotate } from "@/components/magicui/word-rotate";
import InteractiveMenu from "@/components/Home/InteractiveMenu";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";
import SplitText from "@/components/reactbits/SplitText";
import TextType from "@/components/reactbits/TextType";
import { getLatestPostsByIdDesc, getNotices } from "@/lib/static-data";

export const dynamic = "force-static";

export default async function Home() {
  // 强制取 ID 最大的 4 篇文章（即 index.json 中 id 倒数 4 位）
  const recentPosts = getLatestPostsByIdDesc(4);
  const recentNotices = getNotices().slice(0, 2);
  const latestPosts = {
    data: recentPosts,
    meta: { pagination: { page: 1, pageSize: 4, pageCount: 1, total: recentPosts.length } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] relative">
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        @keyframes circuitFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes scrollLeft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scroll-right {
          animation: scrollRight 25s linear infinite;
          display: flex;
          flex-wrap: nowrap;
          will-change: transform;
        }
        
        .animate-scroll-left {
          animation: scrollLeft 25s linear infinite;
          display: flex;
          flex-wrap: nowrap;
          will-change: transform;
        }
        
        @keyframes scrollDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes scrollUp {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        .animate-scroll-down {
          animation: scrollDown 15s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        .animate-scroll-up {
          animation: scrollUp 15s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        .tech-icons-container:hover .animate-scroll-down,
        .tech-icons-container:hover .animate-scroll-up,
        .tech-row:hover .animate-scroll-right,
        .tech-row:hover .animate-scroll-left {
          animation-play-state: paused;
        }
        
        .animate-scroll-down > div,
        .animate-scroll-up > div,
        .animate-scroll-right > div,
        .animate-scroll-left > div {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .tech-icons-container:hover .animate-scroll-down > div:hover,
        .tech-icons-container:hover .animate-scroll-up > div:hover,
        .tech-row:hover .animate-scroll-right > div:hover,
        .tech-row:hover .animate-scroll-left > div:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          z-index: 10;
        }
        
        .tech-icons-container::-webkit-scrollbar {
          width: 5px;
        }
        
        .tech-icons-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        .tech-icons-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        .tech-icons-container:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .dark .tech-icons-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .dark .tech-icons-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .dark .tech-icons-container:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .tech-icon-tooltip {
          position: relative;
        }
        
        .tech-icon-tooltip::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          z-index: 20;
          opacity: 0;
          transition: all 0.2s ease;
          pointer-events: none;
        }
        
        .tech-icon-tooltip:hover::after {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        
        .dark .tech-icon-tooltip::after {
          background-color: rgba(255, 255, 255, 0.8);
          color: black;
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
        @keyframes bambooSway {
          0% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
          100% { transform: rotate(-1deg); }
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
        @keyframes ledBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
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
        .animate-spin {
          animation: spin 8s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-circuit {
          stroke-dasharray: 100;
          animation: circuitFlow 3s linear infinite;
        }
        .animate-cloud {
          animation: cloudDrift 8s ease-in-out infinite;
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
        .animate-bamboo-sway {
          animation: bambooSway 5s ease-in-out infinite;
        }
        .animate-circuit-blink {
          animation: circuitBlink 4s ease-in-out infinite;
        }
        .animate-circuit-pulse {
          animation: circuitPulse 3s ease-in-out infinite;
        }
        .animate-led-blink {
          animation: ledBlink 2s ease-in-out infinite;
        }
        .animate-data-flow {
          stroke-dasharray: 4, 2;
          animation: dataFlow 2s linear infinite;
        }
        
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
        
        .ink-stroke {
          position: absolute;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          stroke: rgba(20, 20, 20, 0.1);
          fill: none;
          z-index: 0;
        }

        /* 移动端性能优化：禁用持续动画，减少 GPU 图层 */
        @media (max-width: 767px) {
          .animate-spin,
          .animate-pulse,
          .animate-float,
          .animate-cloud,
          .animate-ink-spread,
          .animate-bamboo-sway,
          .animate-circuit-blink,
          .animate-circuit-pulse,
          .animate-led-blink,
          .animate-data-flow,
          .animate-circuit {
            animation: none !important;
          }
          .animate-scroll-right,
          .animate-scroll-left,
          .animate-scroll-down,
          .animate-scroll-up {
            will-change: auto !important;
          }
        }

        /* 尊重用户动效偏好 */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
        }}
      />
      {/* 电路线条背景 —— 注意：必须保留 hidden md:block，手机端透明组件会穿透此背景导致视觉混乱，切勿在移动端显示 */}
      <div className="hidden md:block fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <div className="ink-drop"></div>
          <div className="ink-drop"></div>
          <div className="ink-drop"></div>

          <svg
            width="100%"
            height="100%"
            className="absolute inset-0 pointer-events-none"
          >
            <path
              d="M0,100 H600 M0,300 H600 M0,500 H600 M100,0 V600 M300,0 V600 M500,0 V600"
              stroke="#e0e0e0"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="4 4"
              opacity="0.3"
            />

            <path
              d="M50,150 H250 M250,150 V300 M250,300 H400 M400,300 V450 M400,450 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "0.5s", opacity: 0.2 }}
            />

            <path
              d="M0,350 H150 M150,350 V250 M150,250 H300 M300,250 V100 M300,100 H450 M450,100 V200 M450,200 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "1s", opacity: 0.2 }}
            />

            <path
              d="M0,200 H100 M100,200 V400 M100,400 H300 M300,400 V500 M300,500 H500 M500,500 V300 M500,300 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "1.5s", opacity: 0.2 }}
            />

            <circle cx="250" cy="150" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="250" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="400" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="400" cy="450" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="150" cy="350" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="150" cy="250" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="250" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="100" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="100" cy="200" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="100" cy="400" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="400" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="500" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="500" cy="500" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="500" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />

            <rect
              x="175"
              y="148"
              width="16"
              height="4"
              fill="#e0e0e0"
              opacity="0.4"
            />
            <rect
              x="398"
              y="370"
              width="4"
              height="16"
              fill="#e0e0e0"
              opacity="0.4"
            />
            <rect
              x="225"
              y="298"
              width="16"
              height="4"
              fill="#e0e0e0"
              opacity="0.4"
            />

            <circle
              cx="300"
              cy="250"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "0.2s" }}
            />
            <circle
              cx="450"
              cy="100"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "0.8s" }}
            />
            <circle
              cx="100"
              cy="400"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "1.2s" }}
            />
          </svg>
        </div>
      </div>
      <main className="md:snap-y md:snap-mandatory h-screen overflow-y-auto md:scroll-smooth">
        <ParallaxSection
          foregroundImage="HomePageBackground/foreGroundImage.webp"
          midgroundImage="HomePageBackground/midGroundImage.webp"
          backgroundImage="HomePageBackground/backGroundImage.webp"
          backgroundImageDark="HomePageBackground/backGroundImage_dark.webp"
        />
      </main>
      <div className=" flex flex-col items-center justify-center overflow-hidden z-6">
        <BoxReveal boxColor={"#56CFE1"} duration={0.5}>
          <h2 className="mt-[1.5rem] md:mt-[2.5rem] text-[2rem] md:text-[3.5rem]">
            {/* 手机端显示简短文字 */}
            <span className="md:hidden">
              <TextType
                className=" font-semibold text-[#5a5a5a] dark:text-[#b0b0b0]"
                text={[
                  "Welcome to MDG :)",
                  "Have a nice day!😊",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </span>
            {/* 桌面端显示完整文字 */}
            <span className="hidden md:inline">
              <TextType
                className=" font-semibold text-[#5a5a5a] dark:text-[#b0b0b0]"
                text={[
                  "Welcome to MDG in JNU🌲@ Paper Group!",
                  "Hope you have a nice day!❄️",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </span>
          </h2>
        </BoxReveal>
        <h2 className="mt-[1.5rem] md:mt-[2.5rem] text-[1rem] md:text-[1.5rem] text-[#5a5a5a] dark:text-[#b0b0b0] px-4">
          {/* 手机端显示简短文字 - 使用SplitText组件 */}
          <span className="md:hidden">
            <SplitText
              text="《硅原逐梦》—算法为经，模型为纬，编织传说"
              className="text-base font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </span>
          {/* 桌面端显示完整文字 */}
          <span className="hidden md:inline">
            <SplitText
              text="《硅原逐梦：二进制牧歌与模型史诗》——在智能荒原上，我以算法为经，模型为纬，编织硅基智慧的游牧传说。"
              className="text-2xl font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </span>
        </h2>

        <BoxReveal boxColor={"#56CFE1"} duration={0.5}>
          <div className="flex justify-center text-balance mt-3 md:mt-5 px-4">
            <div className="text-balance border-1 border-gray-500 rounded-xl w-full max-w-[80rem] md:min-w-[40rem] lg:min-w-[60rem] xl:min-w-[75rem] h-auto md:h-[21rem] overflow-hidden relative flex items-center">
              <div className="flex flex-col md:flex-row w-full h-full">
                <div className="max-w-[17.5rem] p-4 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2A3B4C]/10 to-[#45B7D1]/10 dark:from-[#3A7D8A]/20 dark:to-[#56CFE1]/20 border border-[#3A7D8A]/20 dark:border-[#56CFE1]/30">
                    <span className="text-[#3A7D8A] dark:text-[#56CFE1]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14"></path>
                      </svg>
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      技术探索
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-4 bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] dark:from-[#3A7D8A] dark:to-[#56CFE1] bg-clip-text text-transparent">
                    分享代码
                    <br />
                    与技术思考
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-l-2 border-[#3A7D8A] dark:border-[#56CFE1] pl-2">
                    编程、算法设计、深度学习、机器学习
                  </p>

                  <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-6">
                    <Link href="/posts" className="cursor-target px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-white flex items-center w-28 shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30 hover:translate-y-[-1px] transition-all">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                      </span>
                      <span className="font-medium text-sm">全部文章</span>
                    </Link>
                    <Link
                      href="/notices"
                      className="cursor-target px-4 py-1.5 bg-gradient-to-r from-sky-600 to-cyan-500 dark:from-sky-700 dark:to-cyan-600 rounded-full text-white flex items-center w-28 shadow-sm shadow-cyan-500/20 dark:shadow-cyan-900/25 hover:shadow-cyan-500/30 dark:hover:shadow-cyan-700/35 hover:translate-y-[-1px] transition-all"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </span>
                      <span className="font-medium text-sm">最近通知</span>
                    </Link>
                  </div>
                </div>

                <div className="hidden md:flex flex-row gap-4 ml-auto px-4 overflow-hidden h-[21rem] w-[19rem] tech-icons-container py-2">
                  <div className="relative overflow-visible w-[8rem] h-full">
                    <div className="flex flex-col absolute w-full animate-scroll-down">
                      <div
                        className="w-[8rem] h-[8rem] bg-[#3776AB]/20 dark:bg-[#3776AB]/30 border-[#3776AB]/30 dark:border-[#3776AB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Python"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                          alt="Python"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#EE4C2C]/20 dark:bg-[#EE4C2C]/30 border-[#EE4C2C]/30 dark:border-[#EE4C2C]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="PyTorch"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
                          alt="PyTorch"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#FF6F00]/20 dark:bg-[#FF6F00]/30 border-[#FF6F00]/30 dark:border-[#FF6F00]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="TensorFlow"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
                          alt="TensorFlow"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#F37626]/20 dark:bg-[#F37626]/30 border-[#F37626]/30 dark:border-[#F37626]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Jupyter"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg"
                          alt="Jupyter"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#4DABCF]/20 dark:bg-[#4DABCF]/30 border-[#4DABCF]/30 dark:border-[#4DABCF]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="NumPy"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
                          alt="NumPy"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#9B59B6]/20 dark:bg-[#9B59B6]/30 border-[#9B59B6]/30 dark:border-[#9B59B6]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Pandas"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
                          alt="Pandas"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>

                      <div
                        className="w-[8rem] h-[8rem] bg-[#3776AB]/20 dark:bg-[#3776AB]/30 border-[#3776AB]/30 dark:border-[#3776AB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Python"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                          alt="Python"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#EE4C2C]/20 dark:bg-[#EE4C2C]/30 border-[#EE4C2C]/30 dark:border-[#EE4C2C]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="PyTorch"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
                          alt="PyTorch"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#FF6F00]/20 dark:bg-[#FF6F00]/30 border-[#FF6F00]/30 dark:border-[#FF6F00]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="TensorFlow"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
                          alt="TensorFlow"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#F37626]/20 dark:bg-[#F37626]/30 border-[#F37626]/30 dark:border-[#F37626]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Jupyter"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg"
                          alt="Jupyter"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#4DABCF]/20 dark:bg-[#4DABCF]/30 border-[#4DABCF]/30 dark:border-[#4DABCF]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="NumPy"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
                          alt="NumPy"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#9B59B6]/20 dark:bg-[#9B59B6]/30 border-[#9B59B6]/30 dark:border-[#9B59B6]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Pandas"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
                          alt="Pandas"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-visible w-[8rem] h-full">
                    <div className="flex flex-col absolute w-full animate-scroll-up">
                      <div
                        className="w-[8rem] h-[8rem] bg-[#F05032]/20 dark:bg-[#F05032]/30 border-[#F05032]/30 dark:border-[#F05032]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Git"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                          alt="Git"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#FCC624]/20 dark:bg-[#FCC624]/30 border-[#FCC624]/30 dark:border-[#FCC624]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Linux"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                          alt="Linux"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#2496ED]/20 dark:bg-[#2496ED]/30 border-[#2496ED]/30 dark:border-[#2496ED]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Docker"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                          alt="Docker"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5C3EE8]/20 dark:bg-[#5C3EE8]/30 border-[#5C3EE8]/30 dark:border-[#5C3EE8]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="OpenCV"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg"
                          alt="OpenCV"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#44A833]/20 dark:bg-[#44A833]/30 border-[#44A833]/30 dark:border-[#44A833]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Anaconda"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg"
                          alt="Anaconda"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#007ACC]/20 dark:bg-[#007ACC]/30 border-[#007ACC]/30 dark:border-[#007ACC]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="VS Code"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                          alt="VS Code"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5066EB]/20 dark:bg-[#5066EB]/30 border-[#5066EB]/30 dark:border-[#5066EB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="DeepSeek"
                      >
                        <Image
                          src="https://cdn.wuyilin18.top/img/deepseek-color.webp"
                          alt="DeepSeek"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>

                      <div
                        className="w-[8rem] h-[8rem] bg-[#F05032]/20 dark:bg-[#F05032]/30 border-[#F05032]/30 dark:border-[#F05032]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Git"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                          alt="Git"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#FCC624]/20 dark:bg-[#FCC624]/30 border-[#FCC624]/30 dark:border-[#FCC624]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Linux"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                          alt="Linux"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#2496ED]/20 dark:bg-[#2496ED]/30 border-[#2496ED]/30 dark:border-[#2496ED]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Docker"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                          alt="Docker"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5C3EE8]/20 dark:bg-[#5C3EE8]/30 border-[#5C3EE8]/30 dark:border-[#5C3EE8]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="OpenCV"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg"
                          alt="OpenCV"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#44A833]/20 dark:bg-[#44A833]/30 border-[#44A833]/30 dark:border-[#44A833]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Anaconda"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg"
                          alt="Anaconda"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#007ACC]/20 dark:bg-[#007ACC]/30 border-[#007ACC]/30 dark:border-[#007ACC]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="VS Code"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                          alt="VS Code"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5066EB]/20 dark:bg-[#5066EB]/30 border-[#5066EB]/30 dark:border-[#5066EB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="DeepSeek"
                      >
                        <Image
                          src="https://cdn.wuyilin18.top/img/deepseek-color.webp"
                          alt="DeepSeek"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BoxReveal>
      </div>
      <div className="relative z-10 flex h-auto md:h-[55rem] min-h-[35rem] md:min-h-[50rem] flex-col items-center justify-center overflow-hidden py-8 md:py-0">
        <div className="z-100 w-full px-4 md:w-auto md:px-0">
          <CardContainer>
            <CardBody className="bg-[linear-gradient(90deg,_#fff_0%,_#e5e7eb_100%)] relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gradient-to-r from-gray-900 to-gray-600 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-full h-auto rounded-xl p-4 md:p-6 border-2 border-gray-200">
              <CardItem
                translateZ={80}
                className=" text-lg md:text-xl font-bold text-neutral-600 dark:text-white "
              >
                <TextAnimate animation="scaleUp" by="text">
                  We are:
                </TextAnimate>
              </CardItem>
              <CardItem
                translateZ={100}
                className=" mt-2 md:mt-3 font-bold text-neutral-600 dark:text-white"
              >
                <div className="flex items-center justify-center ">
                  <div className="mx-2 md:mx-[3rem]  font-normal text-neutral-600 dark:text-neutral-400">
                    <WordRotate
                      className=" text-[2rem] sm:text-[2.5rem] md:text-[3.3rem] font-semibold bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] bg-clip-text text-transparent dark:from-[#3A7D8A] dark:to-[#56CFE1]"
                      words={["暨珠智基社", "论文复现组", "人智探索者"]}
                    />
                  </div>
                </div>
                <div className="mt-2 w-full text-sm text-neutral-500 dark:text-neutral-300 border-b-2"></div>
              </CardItem>
              <CardItem
                translateZ={80}
                className=" text-lg md:text-xl font-bold text-neutral-600 dark:text-white "
              >
                {" "}
                <div className="mt-2 md:mt-3 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
                  <TextAnimate
                    animation="slideLeft"
                    by="character"
                    duration={1}
                    loop={false}
                    loopDelay={3}
                  >
                    代码放牧人，逐硅基水草而居。
                  </TextAnimate>
                </div>
              </CardItem>
              <CardItem
                translateZ={70}
                className="mt-3 md:mt-4 w-full text-base md:text-xl font-bold text-neutral-600 dark:text-white"
              >
                <TextAnimate
                  className=" mt-2 md:mt-3 mb-2 md:mb-3 "
                  animation="scaleUp"
                  by="text"
                >
                  About Us :
                </TextAnimate>
                <div className="h-auto md:h-50 relative">
                  <InteractiveMenu />
                </div>
              </CardItem>
              {/* 手机端占位符 - 用于控制卡片整体宽度，调整 w-[Xrem] 来改变宽度 */}
              <div className="md:hidden w-[15rem] h-0 pointer-events-none"></div>
              <div className="mt-6 md:mt-10 flex items-center justify-between">
                <CardItem
                  translateZ={30}
                  as="a"
                  href="https://github.com/3030Scar?tab=repositories"
                  target="_blank"
                  className="cursor-target rounded-xl pl-8 md:pl-10 pb-3 md:pb-5 text-sm font-normal dark:text-white"
                >
                  GitHub
                </CardItem>
              </div>

              <div className="bg-[#56CFE1] dark:bg-[#FF9470] w-16 h-16 absolute -left-4 -bottom-4 rounded-full -z-10"></div>
            </CardBody>
          </CardContainer>
        </div>
        <div className="hidden md:block">
          <Orbit key="avatar" radius={340} duration={10} delay={5} path>
            <div className="size-30  flex items-center justify-center bg-white rounded-full">
              <Image
                src="/apple-touch-icon.png"
                alt="avatar"
                width={340}
                height={340}
                className="rounded-full"
              />

            </div>
          </Orbit>

          <Orbit
            key="github"
            radius={300}
            duration={22}
            delay={15}
            path
            direction={ORBIT_DIRECTION.CounterClockwise}
          >
            <div className="size-10 flex items-center justify-center bg-white rounded-full">
              <Image
                src="https://cdn.wuyilin18.top/img/github-mark.png"
                alt="GitHub"
                width={300}
                height={300}
              />
            </div>
          </Orbit>

          <Orbit key="MagicUI" radius={300} delay={10} duration={20} path>
            <div className="size-10 flex items-center justify-center bg-white rounded-full">
              <Image
                src="https://cdn.wuyilin18.top/img/MagicUI.png"
                alt="avatar"
                width={300}
                height={300}
              />
            </div>
          </Orbit>
          <Orbit key="AceternityUI" radius={300} delay={10} duration={18} path>
            <div className="size-10 flex items-center justify-center bg-white rounded-full">
              <Image
                src="https://cdn.wuyilin18.top/img/logo.png"
                alt="avatar"
                width={300}
                height={300}
              />
            </div>
          </Orbit>
        </div>
      </div>
      <section
        id="featured-articles"
        className="py-16 z-6"
      >
        <div className="max-w-5xl mx-auto min-h-[35rem] px-4 sm:px-6">
          <div className="mb-12 mt-0 sm:mt-8 md:mt-10 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] dark:from-[#3A7D8A] dark:to-[#56CFE1] bg-clip-text text-transparent">
              最近的动态
            </h2>
            <div className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
              <TextAnimate
                animation="slideLeft"
                by="character"
                duration={1}
                loop={false}
                loopDelay={3}
              >
                在硅原的极夜里点亮函数，于参数的极昼中焊接星光。
              </TextAnimate>
            </div>
          </div>

          {recentNotices.length > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentNotices.map((notice) => (
                <Link
                  key={notice.slug}
                  href="/notices"
                  className="cursor-target group relative overflow-hidden rounded-2xl border border-sky-200/60 dark:border-cyan-800/40 bg-gradient-to-br from-sky-50/80 to-cyan-50/70 dark:from-cyan-950/30 dark:to-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-300/20 dark:hover:shadow-cyan-900/20"
                >
                  <div className="absolute right-3 top-3 text-[10px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-700/60">
                    最近通知
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {new Date(notice.publishDate).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <h3 className="pr-16 text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-200 line-clamp-2">
                    {notice.title}
                  </h3>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    点击前往通知页查看详情
                  </p>
                </Link>
              ))}
            </div>
          )}

          <ArticleList
            posts={latestPosts}
            className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-2 !gap-8 "
          />
          <div className=" mt-10 text-center">
            <Link href="/posts/" className="cursor-target inline-block">
              <InteractiveHoverButton>
                查看更多文章 Start Exploring
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
