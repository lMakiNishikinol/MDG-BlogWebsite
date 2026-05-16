"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FiHome,
  FiFileText,
  FiUser,
  FiMenu,
  FiBell,
  FiArchive,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import FloatingPanel from "./FloatingPanel";
import { ThemeNavItem } from "@/components/theme/ThemeNavItem";
import TooltipPortal from "./TooltipPortal";
import { ScrollProgressCounter } from "./ScrollProgressCounter";
import { SearchNavItem } from "./SearchNavItem";
import { SearchModal } from "@/components/Search/SearchModal";

interface NavigationItem {
  id: number;
  icon: React.ElementType;
  label: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { id: 1, icon: FiHome, label: "主页", href: "/" },
  { id: 2, icon: FiFileText, label: "文章", href: "/posts" },
  { id: 3, icon: FiBell, label: "通知", href: "/notices" },
  { id: 4, icon: FiArchive, label: "资源", href: "/resources" },
  { id: 5, icon: FiUser, label: "关于", href: "/about" },
];

export function Dock() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024); // 默认设为较大的桌面宽度
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 只在客户端执行
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // 获取当前激活的导航项ID
  const getActiveId = () => {
    if (!isMounted || !pathname) return 0;
    if (pathname === "/") return 1;
    if (pathname.includes("/posts")) return 2;
    if (pathname.includes("/notices")) return 3;
    if (pathname.includes("/resources")) return 4;
    if (pathname.includes("/about")) return 5;
    return 0;
  };

  const activeId = getActiveId();

  // 响应式宽度监测
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);
      }
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [isMounted]);

  // 滚动检测
  useEffect(() => {
    if (isMounted) {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMounted]);

  // 搜索处理函数
  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  // 关闭搜索模态框
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // 切换面板
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (!isMounted) {
    return (
      <div style={{ paddingRight: "var(--scrollbar-width, 0px)" }} className="fixed top-2 left-3 right-3 md:top-0 md:left-0 md:right-auto md:w-full z-50 h-12 md:h-20">
        {/* 服务器端渲染的简单占位 */}
        <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between backdrop-blur-md bg-white/40 dark:bg-gray-900/70 rounded-full border border-gray-200/70 dark:border-gray-700/70 shadow-lg md:rounded-b-xl md:rounded-t-none md:border-0 md:border-b md:border-gray-200 md:dark:border-gray-700 md:shadow-sm">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#4361ee] to-[#7209b7] bg-clip-text text-transparent">
            PaperGroup
          </div>
          <div className="w-8 h-8" /> {/* 占位空间 */}
        </div>
      </div>
    );
  }

  return (
    <>
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
            .microchip-element {
              box-shadow: 0 0 5px rgba(255, 148, 112, 0.5);
            }
            .cloud-element {
              filter: blur(15px);
              opacity: 0.07;
            }
            .circuit-grid path {
              stroke: rgba(86, 207, 225, 0.5);
              stroke-width: 0.5;
              fill: none;
            }
            .wave-line {
              opacity: 0.2;
            }
          `,
        }}
      />
      <motion.div
        style={{ paddingRight: "var(--scrollbar-width, 0px)" }}
        className={cn(
          "fixed z-50 transition-all duration-300",
          // 移动端：悬浮胶囊设计
          "top-2 left-3 right-3 md:top-0 md:left-0 md:right-auto md:w-full",
          isScrolled ? "h-11 md:h-16" : "h-12 md:h-20"
        )}
        layout
        initial={false}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        <div className={cn(
          "relative h-full w-full max-w-6xl mx-auto px-4 backdrop-blur-md bg-white/40 dark:bg-gray-900/70 shadow-sm overflow-hidden",
          // 移动端：胶囊圆角 + 全边框 + 浮动阴影
          "rounded-full border border-gray-200/70 dark:border-gray-700/70 shadow-lg",
          // 桌面端：保持原样
          "md:rounded-b-xl md:rounded-t-none md:border-0 md:border-b md:border-gray-200 md:dark:border-gray-700 md:shadow-sm"
        )}>
          {/* 全新电路与云端风格 - 山水景色色调 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 云雾效果 */}
            <div className="absolute inset-0">
              <div className="absolute top-[15%] left-[10%] w-[200px] h-[50px] bg-[#2A3B4C] rounded-full cloud-element animate-cloud-float"></div>
              <div
                className="absolute top-[35%] right-[15%] w-[150px] h-[40px] bg-[#56CFE1] rounded-full cloud-element animate-cloud-float"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute top-[5%] right-[25%] w-[100px] h-[30px] bg-[#45B7D1] rounded-full cloud-element animate-cloud-float"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>

            {/* 电路网格 */}
            <div className="absolute inset-0 circuit-grid">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 80"
                className="opacity-20 dark:opacity-30"
              >
                {/* 集成电路风格网格 */}
                <path
                  d="M0,40 H150 C160,40 160,20 170,20 H250 C260,20 260,40 270,40 H370 C380,40 380,60 390,60 H510 C520,60 520,40 530,40 H630 C640,40 640,20 650,20 H800"
                  stroke="#2A3B4C"
                  strokeWidth="1.2"
                  fill="none"
                  className="animate-data-flow"
                  style={{ animationDuration: "5s" }}
                />

                <path
                  d="M0,20 H100 C110,20 110,40 120,40 H200 C210,40 210,60 220,60 H450 C460,60 460,40 470,40 H550 C560,40 560,20 570,20 H800"
                  stroke="#45B7D1"
                  strokeWidth="0.8"
                  fill="none"
                  className="animate-data-flow"
                  style={{ animationDuration: "6s", animationDelay: "0.5s" }}
                />

                <path
                  d="M0,60 H80 C90,60 90,40 100,40 H300 C310,40 310,20 320,20 H400 C410,20 410,40 420,40 H600 C610,40 610,60 620,60 H800"
                  stroke="#56CFE1"
                  strokeWidth="0.8"
                  fill="none"
                  className="animate-data-flow"
                  style={{ animationDuration: "7s", animationDelay: "1s" }}
                />

                {/* 电路接点 */}
                <circle
                  cx="170"
                  cy="20"
                  r="3"
                  fill="#2A3B4C"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="270"
                  cy="40"
                  r="3"
                  fill="#45B7D1"
                  className="animate-led-blink"
                  style={{ animationDelay: "1s" }}
                />
                <circle
                  cx="390"
                  cy="60"
                  r="3"
                  fill="#56CFE1"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />
                <circle
                  cx="530"
                  cy="40"
                  r="3"
                  fill="#2A3B4C"
                  className="animate-led-blink"
                  style={{ animationDelay: "2s" }}
                />
                <circle
                  cx="650"
                  cy="20"
                  r="3"
                  fill="#45B7D1"
                  className="animate-led-blink"
                  style={{ animationDelay: "2.5s" }}
                />

                {/* 垂直连接 */}
                <path
                  d="M120,40 V10"
                  stroke="#2A3B4C"
                  strokeWidth="0.6"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M220,60 V10"
                  stroke="#45B7D1"
                  strokeWidth="0.6"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />
                <path
                  d="M320,20 V70"
                  stroke="#56CFE1"
                  strokeWidth="0.6"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.6s" }}
                />
                <path
                  d="M420,40 V10"
                  stroke="#2A3B4C"
                  strokeWidth="0.6"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.8s" }}
                />
                <path
                  d="M620,60 V10"
                  stroke="#45B7D1"
                  strokeWidth="0.6"
                  className="animate-data-flow"
                  style={{ animationDelay: "1s" }}
                />

                {/* 芯片元件 */}
                <g
                  transform="translate(350, 40)"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "1.1s", transformOrigin: "center" }}
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

                {/* 波形云线 */}
                <path
                  d="M50,15 C100,5 150,25 200,15 C250,5 300,25 350,15 C400,5 450,25 500,15 C550,5 600,25 650,15 C700,5 750,25 800,15"
                  stroke="#45B7D1"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  fill="none"
                  className="wave-line animate-wave-float"
                />
                <path
                  d="M0,70 C50,60 100,80 150,70 C200,60 250,80 300,70 C350,60 400,80 450,70 C500,60 550,80 600,70 C650,60 700,80 750,70"
                  stroke="#2A3B4C"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  fill="none"
                  className="wave-line animate-wave-float"
                  style={{ animationDelay: "1.5s" }}
                />
              </svg>
            </div>
          </div>

          <div className="h-full flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="cursor-target flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#2A3B4C] to-[#45B7D1] bg-clip-text text-transparent dark:from-[#3A7D8A] dark:to-[#56CFE1] relative">
                  PaperGroup
                  <div className="absolute -right-3 -top-3 w-2 h-2 rounded-full bg-[#45B7D1] animate-led-blink led-chip"></div>
                </span>
              </Link>
            </div>

            {/* 桌面端导航 */}
            {windowWidth > 1024 ? (
              <motion.div
                className="hidden md:flex items-center space-x-4"
                layout
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  },
                }}
              >
                <div className="flex-1 flex items-center space-x-4">
                  {navigation.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      windowWidth={windowWidth}
                      isActive={item.id === activeId}
                    />
                  ))}
                </div>

                {/* 搜索和主题切换区域 */}
                <motion.div
                  className="flex items-center space-x-2"
                  layout
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    },
                  }}
                >
                  {/* 搜索功能区域 - 使用SearchNavItem来触发模态框 */}
                  <div className="cursor-target flex items-center">
                    <SearchNavItem
                      windowWidth={windowWidth}
                      isSearching={false}
                      onSearchClick={handleSearchClick}
                    />
                  </div>

                  {/* 主题切换作为导航项 */}
                  <ThemeNavItem windowWidth={windowWidth} />

                  {/* 进度计数器 - 置于最右侧 */}
                  <ScrollProgressCounter isScrolled={isScrolled} />
                </motion.div>
              </motion.div>
            ) : (
              <div className="cursor-target flex items-center">
                {/* 移动端左侧空间 */}
                <div className="flex-1"></div>

                {/* 移动端右侧工具栏 */}
                <motion.div
                  className="flex items-center space-x-2"
                  layout
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    },
                  }}
                >
                  {/* 移动端进度计数器 */}
                  <ScrollProgressCounter isScrolled={isScrolled} />

                  {/* 移动端菜单按钮 */}
                  <IconButton icon={FiMenu} onClick={togglePanel} />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 移动端浮动面板 */}
      {isMounted && (
        <FloatingPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          navigation={navigation}
        />
      )}

      {/* 搜索模态框 */}
      <SearchModal
        key="navigation-search-modal"
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </>
  );
}

interface NavItemProps {
  item: NavigationItem;
  windowWidth: number;
  isActive: boolean;
  delay?: number;
  animationType?: "spring" | "tween" | "inertia";
}

function NavItem({
  item,
  windowWidth,
  isActive,
  delay = 1000,
  animationType = "spring",
}: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const iconControls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navItemRef = useRef<HTMLDivElement>(null);

  // 根据窗口宽度计算动画参数
  const animationScale = windowWidth < 768 ? 1.05 : 1.1;
  const marginChange = windowWidth < 768 ? "0.5rem" : "0.75rem";

  // 处理鼠标悬浮状态
  const handleMouseEnter = () => {
    setIsHovered(true);

    // 获取位置
    if (navItemRef.current) {
      setAnchorRect(navItemRef.current.getBoundingClientRect());
    }

    // 清除任何现有的计时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的计时器
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);

    // 清除计时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 监听滚动和调整大小以更新位置
  useEffect(() => {
    const updatePosition = () => {
      if (navItemRef.current && showTooltip) {
        setAnchorRect(navItemRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showTooltip]);

  // 为图标设置动画
  useEffect(() => {
    if (isHovered) {
      iconControls.start({
        scale: animationScale,
        margin: marginChange,
      });
    } else {
      iconControls.start({
        scale: 1,
        margin: "0.25rem",
      });
    }
  }, [isHovered, iconControls, animationScale, marginChange]);

  // 点击涟漪效果
  useEffect(() => {
    if (isTapped) {
      const timer = setTimeout(() => setIsTapped(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTapped]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="cursor-target relative flex items-center justify-center"
      ref={navItemRef}
    >
      <Link
        href={item.href}
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => {
          handleMouseEnter();
          setIsTapped(true);
        }}
        onTouchEnd={handleMouseLeave}
        aria-label={item.label}
        role="navigation"
      >
        {/* 图标容器 */}
        <motion.div
          className={cn(
            "p-2 rounded-full relative overflow-hidden transition-colors",
            isActive
              ? "bg-[#45B7D1]/20 dark:bg-[#3A7D8A]/30 text-[#45B7D1] dark:text-[#56CFE1]"
              : isHovered
              ? "bg-gray-200 dark:bg-gray-700 text-[#45B7D1] dark:text-[#56CFE1]"
              : "bg-transparent text-gray-600 dark:text-gray-400"
          )}
          animate={iconControls}
          transition={{
            type: animationType,
            bounce: 0.5,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          {isTapped && (
            <motion.span
              className="absolute inset-0 bg-black/10 rounded-full"
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <item.icon className="w-6 h-6 relative z-1" />

          {/* 新风格：电路背景 */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 40 40"
            className="absolute inset-0 pointer-events-none opacity-30"
          >
            <path
              d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
              stroke={isActive ? "#45B7D1" : "#45B7D1"}
              strokeWidth="0.7"
              fill="none"
              className={isActive ? "animate-data-flow" : ""}
              style={{ animationDuration: "3s" }}
            />
            {isActive && (
              <circle
                cx="20"
                cy="20"
                r="1.5"
                fill="#45B7D1"
                className="animate-led-blink"
              />
            )}
            {/* 波形云线 */}
            <path
              d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
              stroke={isActive ? "#56CFE1" : "#45B7D1"}
              strokeWidth="0.5"
              strokeOpacity="0.5"
              fill="none"
              className={isActive ? "animate-wave-float" : ""}
            />
          </svg>
        </motion.div>
      </Link>

      {/* 使用新的TooltipPortal组件 */}
      <TooltipPortal
        text={item.label}
        anchorRect={anchorRect}
        isVisible={showTooltip}
      />
    </div>
  );
}

function IconButton({
  icon: Icon,
  onClick,
  className,
}: {
  icon: React.ElementType;
  onClick?: () => void;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  useEffect(() => {
    if (isTapped) {
      const timer = setTimeout(() => setIsTapped(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTapped]);

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        setIsTapped(true);
        if (onClick) onClick();
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          "p-2 z-[100] rounded-full relative overflow-hidden",
          isHovered
            ? "bg-gray-200 text-[#45B7D1] dark:bg-gray-700 dark:text-[#56CFE1]"
            : "bg-transparent text-gray-600 dark:text-gray-400"
        )}
      >
        {isTapped && (
          <motion.span
            className="absolute inset-0 bg-black/10 rounded-full"
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <Icon className="w-5 h-5 relative z-1" />

        {/* 新风格：电路元素 */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 30 30"
          className="absolute inset-0 pointer-events-none opacity-30"
        >
          <path
            d="M5,15 H10 C12,15 12,10 15,10 H20 C22,10 22,15 25,15"
            stroke="#2A3B4C"
            strokeWidth="0.7"
            strokeDasharray="2,1"
            fill="none"
            className={isHovered ? "animate-data-flow" : ""}
            style={{ animationDuration: "3s" }}
          />
          {isHovered && (
            <circle
              cx="15"
              cy="15"
              r="1"
              fill="#56CFE1"
              className="animate-led-blink"
            />
          )}
        </svg>
      </div>
    </motion.div>
  );
}
