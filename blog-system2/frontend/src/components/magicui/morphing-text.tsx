"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const morphTime = 1.5;
const cooldownTime = 0.5;

interface GradientColors {
  light: string[];
  dark: string[];
}

interface GradientConfig {
  colors: GradientColors;
  animationDuration?: number;
  animationDirection?: "horizontal" | "vertical" | "diagonal" | "radial";
  pauseBetweenCycles?: number;
}

const defaultGradientConfig: GradientConfig = {
  colors: {
    light: ["#2A3B4C", "#45B7D1", "#3A7D8A", "#56CFE1"],
    dark: ["#3A7D8A", "#56CFE1", "#2A3B4C", "#45B7D1"],
  },
  animationDuration: 4,
  animationDirection: "horizontal",
  pauseBetweenCycles: 0.5,
};

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const isMobileRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    isMobileRef.current = window.matchMedia("(max-width: 767px)").matches;
  }, []);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      if (isMobileRef.current) {
        // 移动端：顺序淡入淡出，前半段淡出旧文字，后半段淡入新文字，避免同时可见
        current2.style.filter = "none";
        current1.style.filter = "none";
        // 淡出/淡入有约 15% 的轻微重叠，营造"变形"过渡感
        // current1: fraction 0→0.6 从 100% 淡出到 0%
        // current2: fraction 0.4→1 从 0% 淡入到 100%
        current1.style.opacity = `${Math.min(1, Math.max(0, (0.6 - fraction) / 0.6)) * 100}%`;
        current2.style.opacity = `${Math.min(1, Math.max(0, (fraction - 0.4) / 0.6)) * 100}%`;

        // 仅在文字切换重叠阶段，触发一个短时渐变模糊脉冲。
        const pulseStart = 0.2;
        const pulseEnd = 0.92;
        let pulse = 0;
        if (fraction > pulseStart && fraction < pulseEnd) {
          const normalized = (fraction - pulseStart) / (pulseEnd - pulseStart);
          pulse = Math.sin(Math.PI * normalized);
        }
        const container = containerRef.current;
        if (container) {
          container.style.setProperty("--mobile-morph-blur-opacity", `${(pulse * 0.62).toFixed(3)}`);
          container.style.setProperty("--mobile-morph-blur-radius", `${(10 + pulse * 12).toFixed(2)}px`);
        }
      } else {
        current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        const invertedFraction = 1 - fraction;
        current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
        current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;
      }

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
    const container = containerRef.current;
    if (container) {
      container.style.setProperty("--mobile-morph-blur-opacity", "0");
      container.style.setProperty("--mobile-morph-blur-radius", "10px");
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref, containerRef };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
  gradientConfig?: Partial<GradientConfig>;
}

const Texts: React.FC<
  Pick<MorphingTextProps, "texts"> & { gradientClass: string }
> = ({ texts, gradientClass }) => {
  const { text1Ref, text2Ref, containerRef } = useMorphingText(texts);
  return (
    <div ref={containerRef} className="relative h-full w-full">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 z-0 h-[58%] -translate-y-1/2 rounded-[999px] bg-gradient-to-r from-cyan-300/45 via-sky-200/40 to-teal-300/45 opacity-0 md:hidden dark:from-cyan-500/28 dark:via-blue-500/24 dark:to-teal-400/30"
        style={{
          opacity: "var(--mobile-morph-blur-opacity, 0)",
          filter: "blur(var(--mobile-morph-blur-radius, 8px))",
          transition: "opacity 180ms ease-out, filter 180ms ease-out",
        }}
      />
      <span
        className={cn(
          "absolute inset-x-0 top-0 z-10 m-auto inline-block w-full",
          gradientClass
        )}
        ref={text1Ref}
      />
      <span
        className={cn(
          "absolute inset-x-0 top-0 z-10 m-auto inline-block w-full",
          gradientClass
        )}
        ref={text2Ref}
      />
    </div>
  );
};

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const GradientStyleInjector: React.FC<{ config: GradientConfig }> = ({
  config,
}) => {
  const { colors, animationDuration = 4, animationDirection = "horizontal" } =
    config;

  const getGradientDirection = () => {
    switch (animationDirection) {
      case "vertical":
        return "to bottom";
      case "diagonal":
        return "to bottom right";
      case "radial":
        return "circle at center";
      default:
        return "to right";
    }
  };

  const lightColors = colors.light.join(", ");
  const darkColors = colors.dark.join(", ");
  const direction = getGradientDirection();
  const isRadial = animationDirection === "radial";

  const css = `
    @keyframes gradientFlowLight {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes gradientFlowDark {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .morphing-gradient-text-light {
      background: ${
        isRadial
          ? `radial-gradient(${direction}, ${lightColors})`
          : `linear-gradient(${direction}, ${lightColors})`
      };
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlowLight ${animationDuration}s ease infinite;
    }
    
    .morphing-gradient-text-dark {
      background: ${
        isRadial
          ? `radial-gradient(${direction}, ${darkColors})`
          : `linear-gradient(${direction}, ${darkColors})`
      };
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlowDark ${animationDuration}s ease infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .morphing-gradient-text-light,
      .morphing-gradient-text-dark {
        animation: none;
        background-size: 100% 100%;
      }
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  gradientConfig: userConfig,
}) => {
  const config: GradientConfig = useMemo(
    () => ({
      ...defaultGradientConfig,
      ...userConfig,
      colors: {
        ...defaultGradientConfig.colors,
        ...userConfig?.colors,
      },
    }),
    [userConfig]
  );

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);

    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const gradientClass = mounted
    ? isDark
      ? "morphing-gradient-text-dark"
      : "morphing-gradient-text-light"
    : "morphing-gradient-text-light";

  return (
    <>
      <GradientStyleInjector config={config} />
      <div
        className={cn(
          "relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none md:h-24 lg:text-[6rem]",
          className
        )}
        style={isMobile ? undefined : { filter: "url(#threshold) blur(0.6px)" }}
      >
        <Texts texts={texts} gradientClass={gradientClass} />
        {!isMobile && <SvgFilters />}
      </div>
    </>
  );
};

export type { GradientConfig, GradientColors };
