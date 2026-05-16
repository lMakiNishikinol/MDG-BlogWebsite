"use client";
import { FC } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import FuzzyText from "@/components/reactbits/FuzzyText";

const NotFoundContent: FC = () => {
  const { theme } = useTheme();

  return (
    <main
      className="
        flex min-h-screen flex-col items-center justify-center 
        p-6 font-mono 
        bg-white text-slate-800
        dark:bg-slate-900 dark:text-slate-300
      "
    >
      <div className="text-7xl font-bold md:text-9xl">
        <FuzzyText
          fontSize="clamp(12rem, 30vw, 20rem)"
          baseIntensity={0.2}
          hoverIntensity={0.6}
          enableHover={true}
          color={theme === "dark" ? "#22d3ee" : "#155e75"}
        >
          404
        </FuzzyText>
      </div>

      <div className="mt-5 text-lg tracking-[0.2em] md:text-xl">
        <FuzzyText
          fontSize="clamp(1rem, 10vw, 4rem)"
          fontWeight="1000"
          baseIntensity={0.1}
          hoverIntensity={0.4}
          enableHover={true}
          color={theme === "dark" ? "#64748b" : "#334155"}
        >
          CONNECTION_TERMINATED
        </FuzzyText>
      </div>

      <p className="mt-10 max-w-sm text-center text-slate-600 dark:text-slate-400">
        你所寻找的页面已在数字虚空中丢失。
        可能是链接错误，或该资源已被永久移除。
      </p>

      <Link
        href="/"
        className="cursor-target group relative mt-10 inline-block px-8 py-3 font-semibold text-cyan-700 dark:text-cyan-300 no-underline"
      >
        <span
          className="
            absolute inset-0 rounded-lg border-2 
            border-cyan-600/80 transition-all duration-300
            group-hover:border-cyan-700
            dark:border-cyan-400/80
            dark:group-hover:border-cyan-300
            group-hover:shadow-[0_0_15px_2px] 
            group-hover:shadow-cyan-500/40
            dark:group-hover:shadow-cyan-400/50
          "
        ></span>
        <span className="relative">RE-ESTABLISH_LINK</span>
      </Link>
    </main>
  );
};

export default NotFoundContent;
