"use client";
import { FC } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const NotFoundContent = dynamic(() => import("@/components/NotFoundContent"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 font-mono bg-white dark:bg-slate-900">
      <div className="text-7xl font-bold md:text-9xl text-cyan-800 dark:text-cyan-400">404</div>
    </main>
  ),
});

const NotFoundPage: FC = () => {
  return <NotFoundContent />;
};

export default NotFoundPage;
