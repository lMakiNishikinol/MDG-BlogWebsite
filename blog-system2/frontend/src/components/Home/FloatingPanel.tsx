"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";

import { ThemeNavItem } from "@/components/theme/ThemeNavItem";
import { SearchModal } from "@/components/Search/SearchModal";

// 导航项类型定义
interface NavigationItem {
  id: number;
  icon: React.ElementType;
  label: string;
  href: string;
}

interface FloatingPanelProps {
  onClose: () => void;
  navigation: NavigationItem[];
  isOpen: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  onClose,
  navigation,
  isOpen,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const handleClosePanel = useCallback(() => {
    onClose();
  }, [onClose]);

  // 初始化窗口宽度
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 打开搜索modal
  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    // 关闭侧边栏
    handleClosePanel();
  };

  // 关闭搜索模态框
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* 添加动画关键帧 */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes ledBlink {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 0.9; }
                }
                @keyframes dataFlow {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes circuitPulse {
                  0% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.03); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.7; }
                }
                @keyframes cloudFloat {
                  0% { transform: translateY(0) translateX(0); }
                  50% { transform: translateY(-2px) translateX(2px); }
                  100% { transform: translateY(0) translateX(0); }
                }
                @keyframes waveFloat {
                  0% { transform: rotate(-1deg) translateY(0); }
                  50% { transform: rotate(1deg) translateY(-3px); }
                  100% { transform: rotate(-1deg) translateY(0); }
                }
                .animate-led-blink {
                  animation: ledBlink 2s ease-in-out infinite;
                }
                .animate-data-flow {
                  stroke-dasharray: 4, 2;
                  animation: dataFlow 2s linear infinite;
                }
                .animate-circuit-pulse {
                  animation: circuitPulse 3s ease-in-out infinite;
                }
                .animate-cloud-float {
                  animation: cloudFloat 5s ease-in-out infinite;
                }
                .animate-wave-float {
                  animation: waveFloat 7s ease-in-out infinite;
                }
                .led-chip {
                  filter: drop-shadow(0 0 3px rgba(86, 207, 225, 0.7));
                }
              `,
            }}
          />

          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClosePanel();
            }}
          />

          {/* 主面板 */}
          <motion.div
            ref={panelRef}
            className="fixed top-16 right-3 h-auto max-h-[80vh] w-[75vw] max-w-xs z-50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow-xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* 电路与云端背景 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* 云雾效果 */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-[10%] left-[10%] w-[150px] h-[40px] bg-[#2A3B4C] rounded-full"
                  style={{ filter: "blur(15px)", opacity: "0.07" }}
                ></div>
                <div
                  className="absolute top-[30%] right-[15%] w-[120px] h-[30px] bg-[#56CFE1] rounded-full"
                  style={{
                    filter: "blur(15px)",
                    opacity: "0.07",
                    animationDelay: "1.5s",
                  }}
                ></div>
                <div
                  className="absolute top-[50%] left-[20%] w-[100px] h-[25px] bg-[#45B7D1] rounded-full"
                  style={{
                    filter: "blur(15px)",
                    opacity: "0.07",
                    animationDelay: "0.8s",
                  }}
                ></div>
              </div>

              {/* 电路网格 */}
              <div className="absolute inset-0">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 800"
                  className="opacity-20 dark:opacity-[0.08]"
                >
                  {/* 垂直电路线 */}
                  <path
                    d="M100,0 V800"
                    stroke="#2A3B4C"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s" }}
                  />
                  <path
                    d="M200,0 V800"
                    stroke="#45B7D1"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s", animationDelay: "0.5s" }}
                  />
                  <path
                    d="M300,0 V800"
                    stroke="#56CFE1"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s", animationDelay: "1s" }}
                  />

                  {/* 水平连接线 */}
                  <path
                    d="M0,200 H400"
                    stroke="#2A3B4C"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s" }}
                  />
                  <path
                    d="M0,400 H400"
                    stroke="#45B7D1"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s", animationDelay: "0.5s" }}
                  />
                  <path
                    d="M0,600 H400"
                    stroke="#56CFE1"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s", animationDelay: "1s" }}
                  />

                  {/* 电路节点 */}
                  <circle
                    cx="100"
                    cy="200"
                    r="3"
                    fill="#2A3B4C"
                    className="animate-led-blink"
                  />
                  <circle
                    cx="200"
                    cy="400"
                    r="3"
                    fill="#45B7D1"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.7s" }}
                  />
                  <circle
                    cx="300"
                    cy="600"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.4s" }}
                  />

                  {/* 芯片元素 */}
                  <g
                    transform="translate(200, 300)"
                    className="animate-circuit-pulse"
                    style={{
                      animationDelay: "1.1s",
                      transformOrigin: "center",
                    }}
                  >
                    <rect
                      x="-15"
                      y="-10"
                      width="30"
                      height="20"
                      rx="2"
                      stroke="#2A3B4C"
                      strokeWidth="0.7"
                      fill="none"
                    />
                    <line
                      x1="-9"
                      y1="-10"
                      x2="-9"
                      y2="10"
                      stroke="#2A3B4C"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="-3"
                      y1="-10"
                      x2="-3"
                      y2="10"
                      stroke="#2A3B4C"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="3"
                      y1="-10"
                      x2="3"
                      y2="10"
                      stroke="#2A3B4C"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="9"
                      y1="-10"
                      x2="9"
                      y2="10"
                      stroke="#2A3B4C"
                      strokeWidth="0.4"
                    />
                  </g>

                  {/* 山水波形线 */}
                  <path
                    d="M50,100 C100,80 150,120 200,100 C250,80 300,120 350,100"
                    stroke="#45B7D1"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    fill="none"
                    className="animate-wave-float"
                  />
                  <path
                    d="M50,500 C100,480 150,520 200,500 C250,480 300,520 350,500"
                    stroke="#56CFE1"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    fill="none"
                    className="animate-wave-float"
                    style={{ animationDelay: "1.2s" }}
                  />
                </svg>
              </div>
            </div>

            <div className="h-full flex flex-col relative z-10">
              {/* 头部 */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-lg font-bold bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] bg-clip-text text-transparent dark:from-[#3A7D8A] dark:to-[#56CFE1] relative">
                  PaperGroup
                  <div className="absolute -right-3 -top-3 w-2 h-2 rounded-full bg-[#45B7D1] animate-led-blink led-chip"></div>
                </span>
                <button
                  onClick={handleClosePanel}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-[#45B7D1] dark:hover:text-[#56CFE1]"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* 搜索区域 - 修改为与导航菜单项相似的样式 */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={handleSearchClick}
                  className="cursor-target flex items-center py-2 px-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
                >
                  <div className="relative w-8 h-8 flex items-center justify-center mr-2">
                    <FiSearch className="w-5 h-5 text-[#2A3B4C] dark:text-[#3A7D8A] relative z-1" />
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 40 40"
                      className="absolute inset-0 pointer-events-none opacity-30"
                    >
                      <path
                        d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
                        stroke="#45B7D1"
                        strokeWidth="0.7"
                        fill="none"
                      />
                      <path
                        d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
                        stroke="#56CFE1"
                        strokeWidth="0.5"
                        strokeOpacity="0.5"
                        fill="none"
                        className="animate-wave-float"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-800 dark:text-white hover:text-[#45B7D1] dark:hover:text-[#56CFE1]">
                    搜索
                  </span>
                </motion.div>
              </div>

              {/* 导航菜单 */}
              <div className="px-3 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="cursor-target flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={handleClosePanel}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center mr-1">
                      <item.icon className="w-5 h-5 text-[#2A3B4C] dark:text-[#3A7D8A] relative z-1" />
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 40 40"
                        className="absolute inset-0 pointer-events-none opacity-30"
                      >
                        <path
                          d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
                          stroke="#45B7D1"
                          strokeWidth="0.7"
                          fill="none"
                        />
                        {/* 山水波形线 */}
                        <path
                          d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
                          stroke="#56CFE1"
                          strokeWidth="0.5"
                          strokeOpacity="0.5"
                          fill="none"
                          className="animate-wave-float"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-800 dark:text-white hover:text-[#45B7D1] dark:hover:text-[#56CFE1]">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 底部区域 */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center">
                  <ThemeNavItem windowWidth={windowWidth} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 搜索模态框 */}
      <SearchModal
        key="floating-panel-search-modal"
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </AnimatePresence>
  );
};

export default FloatingPanel;
