import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "所有文章",
  description: "浏览所有文章",
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
