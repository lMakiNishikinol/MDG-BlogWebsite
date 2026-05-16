"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 导航进度条组件
 * 在用户点击内部链接的瞬间立即显示顶部进度条，
 * 提供即时视觉反馈，避免页面看起来"卡住"。
 */
export default function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 路径变化时说明导航已完成，隐藏进度条
  useEffect(() => {
    setIsNavigating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname]);

  // 监听全局点击事件，拦截内部链接点击
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 找到最近的 <a> 元素
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // 跳过外部链接、锚点链接、新窗口链接、下载链接
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // 跳过带修饰键的点击（用户想在新标签页打开）
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // 如果目标路径与当前路径不同，立即显示进度条
      const targetPath = href.split("?")[0].split("#")[0];
      if (targetPath !== pathname) {
        setIsNavigating(true);

        // 安全超时：防止导航失败后进度条一直显示
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
        }, 8000);
      }
    };

    // 使用 capture 阶段以尽早拦截
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  // 清理
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* 进度条背景 */}
          <div className="h-[3px] w-full bg-transparent overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#45B7D1] via-[#89f7fe] to-[#45B7D1]"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "linear",
              }}
              style={{ width: "50%" }}
            />
          </div>

          {/* 顶部发光效果 */}
          <div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(69,183,209,0.4), transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
