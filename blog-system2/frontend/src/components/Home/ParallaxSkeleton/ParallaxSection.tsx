"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { MorphingText } from "@/components/magicui/morphing-text";
import { useTheme } from "next-themes";

export function ParallaxSection({
  foregroundImage,
  midgroundImage,
  backgroundImage,
  backgroundImageDark,
}: {
  foregroundImage: string;
  midgroundImage: string;
  backgroundImage: string;
  backgroundImageDark?: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);

  // 桌面端：启用滚动驱动视差；移动端：跳过以节省性能
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const customEase = cubicBezier(0.42, 0, 0.58, 1);

  // 移动端所有 y 值固定为 "0%"，不监听滚动
  const backgroundY = useTransform(scrollYProgress, [0.9, 1], isMobile ? ["0%", "0%"] : ["0%", "60%"], {
    ease: customEase,
  });

  const midgroundY = useTransform(scrollYProgress, [1, 0.2], isMobile ? ["0%", "0%"] : ["0%", "15%"], {
    ease: customEase,
  });

  const foregroundY = useTransform(scrollYProgress, [0, 0.7], isMobile ? ["0%", "0%"] : ["60%", "0%"], {
    ease: customEase,
  });

  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "18%"], {
    ease: customEase,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden width: 100%;"
    >
      {/* 后景层 - 移动端静态展示 */}
      <motion.div style={isMobile ? undefined : { y: backgroundY }} className="absolute inset-0 z-0 will-change-transform [transform:translateZ(0)]">
        <Image
          src={backgroundImage}
          alt="后景"
          fill
          className="object-cover"
          priority
        />
        {backgroundImageDark && (
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: isDark ? 1 : 0 }}
          >
            <Image
              src={backgroundImageDark}
              alt="后景暗色"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </motion.div>

      {/* 中景层 - 移动端无视差，简化滤镜为 CSS transition */}
      <motion.div style={isMobile ? undefined : { y: midgroundY }} className="absolute inset-0 z-10 will-change-transform [transform:translateZ(0)]">
        <div
          className="absolute inset-0 transition-[filter] duration-700 ease-in-out"
          style={{
            filter: isDark
              ? isMobile
                ? "brightness(0.9) saturate(1.12) contrast(1.08)"
                : "brightness(0.88) saturate(1.08)"
              : "brightness(1) saturate(1) contrast(1)",
          }}
        >
          <Image src={midgroundImage} alt="中景" fill className="object-cover" />
        </div>
        {/* 暗色氛围遮罩 */}
        <div
          className={`absolute inset-x-0 transition-opacity duration-700 ease-in-out ${isMobile ? "inset-y-0" : "-inset-y-[50%]"}`}
          style={{
            opacity: isDark ? 1 : 0,
            background: isMobile
              ? "linear-gradient(180deg, rgba(15,20,30,0.06) 0%, rgba(10,15,25,0.08) 100%)"
              : "linear-gradient(180deg, rgba(15,20,30,0.12) 0%, rgba(10,15,25,0.15) 100%)",
          }}
        />
        {/* 青色保留层 - 仅桌面端 */}
        {!isMobile && (
          <motion.div
            className="absolute -inset-y-[50%] inset-x-0"
            initial={false}
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(2, 235, 236, 0.04) 0%, transparent 55%)",
              mixBlendMode: "color-dodge",
            }}
          />
        )}
      </motion.div>

      {/* 文字层 */}
      <motion.div
        style={isMobile ? undefined : { y: textY }}
        className="absolute inset-0 z-20 flex items-center justify-center-center pointer-events-none"
      >
        <MorphingText texts={["论文复现组", "PaperGroup"]} />
      </motion.div>

      {/* 前景层 - 移动端无视差，简化滤镜为 CSS transition */}
      <motion.div
        style={isMobile ? undefined : { y: foregroundY }}
        className="absolute inset-0 bottom-0 left-0 z-30 pointer-events-none will-change-transform [transform:translateZ(0)]"
      >
        <div
          className="relative w-full h-full transition-[filter] duration-700 ease-in-out"
          style={{
            filter: isDark
              ? isMobile
                ? "brightness(0.88) saturate(1.12) contrast(1.08)"
                : "brightness(0.84) saturate(1.08)"
              : "brightness(1) saturate(1) contrast(1)",
          }}
        >
          <Image
            src={foregroundImage}
            alt="前景"
            fill
            className="object-cover object-bottom"
            style={{
              maskImage: "linear-gradient(transparent 0%, black:20%)",
            }}
          />
        </div>
        {/* 暗色氛围遮罩 */}
        <div
          className={`absolute inset-x-0 transition-opacity duration-700 ease-in-out ${isMobile ? "inset-y-0" : "-inset-y-[50%]"}`}
          style={{
            opacity: isDark ? 1 : 0,
            background: isMobile
              ? "linear-gradient(to top, rgba(10,15,25,0.06) 0%, rgba(15,20,30,0.04) 100%)"
              : "linear-gradient(to top, rgba(10,15,25,0.15) 0%, rgba(15,20,30,0.1) 100%)",
          }}
        />
        {/* 青色保留层 - 仅桌面端 */}
        {!isMobile && (
          <motion.div
            className="absolute -inset-y-[50%] inset-x-0"
            initial={false}
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(2, 235, 236, 0.05) 0%, transparent 55%)",
              mixBlendMode: "color-dodge",
            }}
          />
        )}
      </motion.div>

      {/* 底部渐变融合层 —— 与页面背景色自然衔接 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none h-[25vh] md:hidden"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, #2a2c31 100%)"
            : "linear-gradient(to bottom, transparent 0%, #f5f7fa 100%)",
        }}
      />
    </div>
  );
}
