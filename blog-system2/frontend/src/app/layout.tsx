import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Viewport } from "next";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "暨珠智基 | 论文复现组",
  description: "探索人工智能前沿 · 复现经典论文 · 构建学术基础",
};

// 定义CSS变量
// const fontVariables = {
//   "--font-geist-sans":
//     "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//   "--font-geist-mono":
//     "'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
// };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased"
        // style={fontVariables as React.CSSProperties}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
