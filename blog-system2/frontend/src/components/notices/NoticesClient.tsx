"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiClock, FiChevronRight } from "react-icons/fi";
import { TbPinFilled } from "react-icons/tb";
import type { StaticNotice } from "@/lib/static-data";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface NoticesClientProps {
  notices: StaticNotice[];
  contents: Record<string, string>;
}

export default function NoticesClient({
  notices,
  contents,
}: NoticesClientProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeNotice = activeSlug
    ? notices.find((n) => n.slug === activeSlug) ?? null
    : null;

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setActiveSlug(null);
  }, []);

  // ESC 关闭 + 阻止 body 滚动
  useEffect(() => {
    if (!activeSlug) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // 补偿滚动条消失导致的页面跳动
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [activeSlug, closeModal]);

  /** 将日期格式化为相对时间 */
  function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
    return `${Math.floor(diffDays / 365)} 年前`;
  }

  return (
    <div className="min-h-screen w-full pt-20 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
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
            .animate-float-up {
              animation: floatUp 0.8s ease-out forwards;
            }
            .animate-scale-in {
              animation: scaleIn 0.8s ease-out forwards;
            }
            .notice-item {
              opacity: 0;
              transform: translateY(20px);
              animation: floatUp 0.6s ease-out forwards;
              animation-delay: var(--delay, 0s);
            }

            /* ---- 弹窗卡片发光小球效果 ---- */
            .notice-modal-blob {
              position: absolute;
              z-index: 1;
              width: 260px;
              height: 260px;
              margin-left: -130px;
              margin-top: -130px;
              border-radius: 50%;
              background-color: #45B7D1;
              opacity: 1;
              top: 0;
              left: 0;
              -webkit-filter: blur(12px);
              filter: blur(12px);
              -webkit-transform: translateZ(0);
              transform: translateZ(0);
              will-change: top, left;
              -webkit-animation: notice-blob-trace 10s infinite;
              animation: notice-blob-trace 10s infinite;
            }
            :is(.dark) .notice-modal-blob {
              background-color: #56CFE1;
              opacity: 0.85;
            }
            .notice-modal-bg {
              position: absolute;
              z-index: 2;
              top: 5px;
              left: 5px;
              right: 5px;
              bottom: 5px;
              border-radius: 13px;
              background: rgba(255, 255, 255, 0.70);
              -webkit-backdrop-filter: blur(24px);
              backdrop-filter: blur(24px);
              outline: 2px solid rgba(255, 255, 255, 0.9);
            }
            :is(.dark) .notice-modal-bg {
              background: rgba(31, 41, 55, 0.80);
              outline-color: rgba(55, 65, 81, 0.8);
            }
            @-webkit-keyframes notice-blob-trace {
              0%, 4%   { top: 0; left: 0; }
              21%, 29% { top: 0; left: 100%; }
              46%, 54% { top: 100%; left: 100%; }
              71%, 79% { top: 100%; left: 0; }
              96%, 100% { top: 0; left: 0; }
            }
            @keyframes notice-blob-trace {
              0%, 4%   { top: 0; left: 0; }
              21%, 29% { top: 0; left: 100%; }
              46%, 54% { top: 100%; left: 100%; }
              71%, 79% { top: 100%; left: 0; }
              96%, 100% { top: 0; left: 0; }
            }
            /* 移动端缩小 blob 并降低模糊提升性能 */
            @media (hover: none) and (pointer: coarse) {
              .notice-modal-blob {
                width: 180px;
                height: 180px;
                margin-left: -90px;
                margin-top: -90px;
                -webkit-filter: blur(8px);
                filter: blur(8px);
              }
              .notice-modal-bg {
                -webkit-backdrop-filter: blur(16px);
                backdrop-filter: blur(16px);
              }
            }
          `,
        }}
      />

      <div className="mx-auto max-w-screen-md px-6 sm:px-10 md:px-16">
        {/* 页面标题 */}
        <div
          className="text-center mb-12 opacity-0 animate-float-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] inline-block relative">
            通知公告
            <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a5a5a] dark:text-[#b0b0b0]">
              信号塔
            </span>
          </h1>
          <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
            来自硅原控制中枢的信号脉冲。
          </p>
        </div>

        {/* 通知列表 */}
        {!notices || notices.length === 0 ? (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
            style={{
              animationDelay: "0.3s",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.03)",
              border: "1px solid rgba(150,150,150,0.1)",
            }}
          >
            <div className="text-center relative z-10">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                暂无通知
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                当前没有新的通知公告
              </p>
            </div>
          </div>
        ) : (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
            style={{
              animationDelay: "0.3s",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.03)",
              border: "1px solid rgba(150,150,150,0.1)",
            }}
          >
            {/* 装饰角线 */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg" />

            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {notices.map((notice, index) => (
                <button
                  key={notice.id}
                  onClick={() => setActiveSlug(notice.slug)}
                  className="cursor-target notice-item w-full text-left px-6 py-5 group relative transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#45B7D1]/40 focus-visible:ring-inset"
                  style={
                    { "--delay": `${0.15 + index * 0.08}s` } as React.CSSProperties
                  }
                >
                  <div className="flex items-center gap-4">
                    {/* 时间线圆点 */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ring-4 transition-all duration-300 ${
                          notice.pinned
                            ? "bg-[#45B7D1] ring-[#45B7D1]/20 group-hover:ring-[#45B7D1]/40"
                            : "bg-gray-300 dark:bg-gray-500 ring-gray-100 dark:ring-gray-700 group-hover:bg-[#45B7D1] group-hover:ring-[#45B7D1]/20"
                        }`}
                      />
                    </div>

                    {/* 内容区 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {notice.pinned && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#45B7D1] bg-[#45B7D1]/10 px-1.5 py-0.5 rounded">
                            <TbPinFilled className="w-2.5 h-2.5" />
                            <span className="hidden sm:inline">置顶</span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap sm:flex-nowrap">
                          <FiClock className="w-3 h-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {new Date(notice.publishDate).toLocaleDateString(
                              "zh-CN",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600 mx-0.5 hidden sm:inline">
                            ·
                          </span>
                          <span className="sm:whitespace-nowrap">
                            {formatRelativeDate(notice.publishDate)}
                          </span>
                        </span>
                      </div>

                      <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-[#45B7D1] dark:group-hover:text-[#56CFE1] transition-colors duration-200">
                        {notice.title}
                      </h3>
                    </div>

                    {/* 箭头 */}
                    <FiChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-[#45B7D1] group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-float-up"
          style={{ animationDelay: "0.7s" }}
        >
          点击通知查看完整内容
        </div>
      </div>

      {/* ============ 通知详情弹窗 ============ */}
      <AnimatePresence>
        {activeSlug && activeNotice && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
            />

            {/* 弹窗卡片 */}
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto relative w-full max-w-2xl max-h-[75vh] sm:max-h-[80vh] rounded-2xl overflow-hidden"
                initial={{ scale: 0.92, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.92, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
                style={{
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.15), 0 0 40px rgba(69,183,209,0.08)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 动态发光小球 */}
                <div className="notice-modal-blob" />

                {/* 内层背景面板 */}
                <div className="notice-modal-bg" />

                {/* 内容层 - 与 bg 面板对齐内缩 */}
                <div className="relative z-[3] flex flex-col overflow-hidden" style={{ margin: '5px', borderRadius: '13px', maxHeight: 'calc(75vh - 10px)' }}>
                {/* 头部 */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/40">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {activeNotice.pinned && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#45B7D1] bg-[#45B7D1]/10 px-1.5 py-0.5 rounded">
                            <TbPinFilled className="w-2.5 h-2.5" />
                            置顶
                          </span>
                        )}
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(
                            activeNotice.publishDate
                          ).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {activeNotice.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeModal}
                      className="cursor-target flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="关闭"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 内容区 - 可滚动 */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {contents[activeSlug] ? (
                    <MarkdownRenderer
                      content={contents[activeSlug]}
                      slug={activeSlug}
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      暂无内容
                    </p>
                  )}
                </div>

                </div>{/* /内容层 */}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
