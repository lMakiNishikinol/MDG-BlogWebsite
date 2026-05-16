"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiGlobe,
  FiTool,
  FiLink,
  FiExternalLink,
  FiDownload,
  FiStar,
} from "react-icons/fi";
import type { ResourceCategory } from "@/lib/static-data";

interface ResourcesClientProps {
  categories: ResourceCategory[];
}

const AUTO_REFRESH_GUARD_KEY = "resources-auto-refresh-guard-v1";

const iconMap: Record<string, React.ElementType> = {
  book: FiBook,
  globe: FiGlobe,
  tool: FiTool,
  link: FiLink,
};

/** 判断 URL 是否指向可下载文件 */
function isDownloadUrl(url: string): boolean {
  return /\.(pdf|zip|rar|7z|tar|gz|epub|mobi|docx?)(\?|$)/i.test(url);
}

export default function ResourcesClient({
  categories,
}: ResourcesClientProps) {
  const [isReady, setIsReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id ?? ""
  );

  const current = categories.find((c) => c.id === activeCategory);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    // 仅在生产环境启用：若首屏元素仍不可见（疑似白屏），自动刷新一次自愈。
    if (process.env.NODE_ENV !== "production") return;

    const timer = window.setTimeout(() => {
      const alreadyRefreshed =
        window.sessionStorage.getItem(AUTO_REFRESH_GUARD_KEY) === "1";

      const titleEl = document.querySelector<HTMLElement>(
        "[data-resources-title]"
      );
      const cardEls = document.querySelectorAll<HTMLElement>(
        "[data-resource-card]"
      );

      const titleOpacity = titleEl
        ? Number.parseFloat(window.getComputedStyle(titleEl).opacity || "1")
        : 0;
      const titleHidden = titleOpacity < 0.1;

      const cardsAllHidden =
        cardEls.length > 0
          ? Array.from(cardEls).every(
              (el) =>
                Number.parseFloat(window.getComputedStyle(el).opacity || "1") <
                0.1
            )
          : false;

      const shouldAutoRefresh = titleHidden || cardsAllHidden;

      if (shouldAutoRefresh && !alreadyRefreshed) {
        window.sessionStorage.setItem(AUTO_REFRESH_GUARD_KEY, "1");
        window.location.reload();
        return;
      }

      // 页面已正常展示时清除标记，便于未来偶发故障再次触发一次自愈。
      if (!shouldAutoRefresh && alreadyRefreshed) {
        window.sessionStorage.removeItem(AUTO_REFRESH_GUARD_KEY);
      }
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [categories.length, current?.id]);

  return (
    <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes floatUp {
              0% { transform: translateY(20px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes scaleIn {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-float-up {
              animation: floatUp 0.8s ease-out forwards;
            }
            .animate-scale-in {
              animation: scaleIn 0.6s ease-out forwards;
            }
            .resource-card {
              opacity: 1;
            }
          `,
        }}
      />

      <div className="mx-auto max-w-screen-lg px-4 sm:px-8 md:px-12">
        {/* ========== 页面标题 ========== */}
        <div
          data-resources-title
          className={`text-center mb-10 ${isReady ? "animate-float-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] inline-block relative">
            资源导航
            <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a5a5a] dark:text-[#b0b0b0]">
              数据库
            </span>
          </h1>
          <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto font-medium text-sm">
            来自硅原数据库的精选资源节点。
          </p>
        </div>

        {/* ========== 分类切换标签 ========== */}
        <div
          className={`flex justify-center mb-8 ${isReady ? "animate-float-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/40 shadow-sm">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || FiLink;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cursor-target relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:text-[#5A8FB5] dark:hover:text-[#4A9FBF] hover:bg-[#1E5A8E]/8 dark:hover:bg-[#2E7BB8]/15"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5A8FB5] to-[#7AB8D5] dark:from-[#3A7BA3] dark:to-[#4A9FBF]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{cat.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========== 分类描述 ========== */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.p
              key={current.id + "-desc"}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {current.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ========== 资源卡片网格 ========== */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {current.items.map((item) => {
                const isDownload = isDownloadUrl(item.url);
                return (
                  <a
                    key={item.id}
                    data-resource-card
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card cursor-target group relative block rounded-2xl p-5 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#45B7D1]/8 dark:hover:shadow-[#45B7D1]/5 hover:border-[#45B7D1]/30 dark:hover:border-[#45B7D1]/20 hover:-translate-y-0.5"
                  >
                    {/* 装饰角线 */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gray-300/40 dark:border-gray-600/30 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gray-300/40 dark:border-gray-600/30 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* 标题行 */}
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.pinned && (
                            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                          )}
                          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate group-hover:text-[#45B7D1] dark:group-hover:text-[#56CFE1] transition-colors duration-200">
                            {item.title}
                          </h3>
                        </div>

                        {/* 描述 */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                          {item.description}
                        </p>

                        {/* 标签 */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-600/30 group-hover:bg-[#45B7D1]/10 group-hover:text-[#45B7D1] group-hover:border-[#45B7D1]/20 transition-colors duration-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 右侧图标 */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/40 text-gray-400 dark:text-gray-500 group-hover:bg-[#45B7D1]/10 group-hover:text-[#45B7D1] transition-all duration-300 group-hover:scale-110">
                          {isDownload ? (
                            <FiDownload className="w-4 h-4" />
                          ) : (
                            <FiExternalLink className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== 空态 ========== */}
        {categories.length === 0 && (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
            style={{
              animationDelay: "0.3s",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.03)",
              border: "1px solid rgba(150,150,150,0.1)",
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                暂无资源
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                资源库正在建设中，敬请期待
              </p>
            </div>
          </div>
        )}

        {/* ========== 底部提示 ========== */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id + "-hint"}
              className="text-center mt-8 text-sm text-gray-400 dark:text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              点击卡片将在新标签页中打开链接
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
