"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Dock } from "@/components/Home/naver";
import { Footer } from "@/components/Footer/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AlgoliaProvider } from "@/components/Search/AlgoliaProvider";
import TargetCursor from "@/components/reactbits/TargetCursor";
import NavigationProgress from "@/components/NavigationProgress";
// 引入 Framer Motion
import { AnimatePresence, motion } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <NavigationProgress />
      <AlgoliaProvider>
        <Dock />
        {/* AnimatePresence 包裹你的页面内容 */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{
              opacity: 0,
              ...(isMobile ? {} : { filter: "blur(8px)", scale: 1.05 }),
            }}
            animate={{
              opacity: 1,
              ...(isMobile ? {} : { filter: "blur(0px)", scale: 1 }),
            }}
            exit={{
              opacity: 0,
              ...(isMobile ? {} : { filter: "blur(8px)", scale: 0.95 }),
            }}
            transition={{ duration: isMobile ? 0.2 : 0.4, ease: "easeInOut" }}
            className="min-h-screen"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </AlgoliaProvider>
    </ThemeProvider>
  );
}
