"use client";
import { FiGithub } from "react-icons/fi";
import { SiBilibili } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";

export const AuthorBlock = () => {
  return (
    <div className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-500 sticky top-32 author-block-bg">
      {/* 添加CSS样式 */}
      <style>{`
        .author-block-bg {
          background-image: linear-gradient(
            120deg,
            #84fab0ff 0%,
            #8fd3f4ff 100%
          );
        }

        :global(.dark) .author-block-bg {
          background-image: linear-gradient(
            120deg,
            #89f7feff 0%,
            #66a6ffff 100%
          );
        }
      `}</style>
      {/* 内容区域 */}
      <div className="relative z-10 p-6 text-white">
        {/* 顶部标语 */}
        <div className="text-center mb-6">
          <p className="text-white/90 text-sm font-medium">
            保持热爱，奔赴星海
          </p>
        </div>

        {/* 头像区域 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 头像背景装饰 */}
            <div className="absolute -inset-4 rounded-full opacity-30">
              {/* 左侧粉色装饰 */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-pink-400 rounded-full opacity-60"></div>
              {/* 右上角橙色装饰 */}
              <div className="absolute right-2 top-2 w-8 h-8 bg-orange-300 rounded-full opacity-70"></div>
            </div>

            {/* 主头像 */}
            <div className="relative w-20 h-20 rounded-full bg-white p-1 shadow-lg">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="https://cdn.wuyilin18.top/img/avatar.png"
                  alt="论文复现组"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            {/* 状态表情 */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-sm">😊</span>
            </div>
          </div>
        </div>

        {/* 底部信息区域 */}
        <div className="flex items-end justify-between">
          {/* 左侧个人信息 */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">论文复现组</h3>
            <p className="text-white/80 text-sm">分享代码与技术思考</p>
          </div>

          {/* 右侧社交图标 */}
          <div className="flex space-x-3">
            <Link
              href="https://github.com/wuyilin18"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <FiGithub className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  GitHub
                </div>
              </div>
            </Link>
            <Link
              href="https://space.bilibili.com/379914795"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="哔哩哔哩"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <SiBilibili className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  哔哩哔哩
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/15 rounded-lg rotate-45"></div>

        {/* 悬浮装饰点 */}
        <div
          className="absolute top-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 微妙的边框 */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>

      {/* 底部光晕效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
    </div>
  );
};
