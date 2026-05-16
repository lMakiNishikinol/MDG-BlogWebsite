import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 | 论文复现组",
  description: "了解更多关于论文复现组的信息，我们的技术栈和规划",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
