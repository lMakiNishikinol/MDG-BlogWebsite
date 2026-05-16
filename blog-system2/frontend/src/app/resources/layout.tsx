import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "资源导航 | 论文复现组",
  description: "精选学习资源、推荐书籍、优质博客与常用工具导航",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
