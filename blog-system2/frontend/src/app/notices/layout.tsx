import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通知公告 | 论文复现组",
  description: "浏览所有通知公告",
};

export default function NoticesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
