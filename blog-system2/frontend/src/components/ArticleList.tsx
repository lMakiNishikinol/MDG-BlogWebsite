"use client";

import React from "react";
import ArticleCard from "@/components/ArticleCard";
import { StaticPost } from "@/lib/static-data";

interface ArticleListProps {
  posts: { data: StaticPost[] } | StaticPost[] | null | undefined;
  className?: string;
}

function getFullImageUrl(url?: string) {
  if (!url) return "https://cdn.wuyilin18.top/img/7245943.png";
  return url.startsWith("/uploads/") ? `https://api.wuyilin18.top${url}` : url;
}

function processPost(post: StaticPost) {
  return {
    id: post.id || 0,
    title: post.title || "无标题",
    slug: post.slug || String(post.id || 0),
    publishDate: post.publishDate || new Date().toISOString(),
    summary: post.summary,
    coverImage: getFullImageUrl(post.coverImage),
  };
}

export default function ArticleList({
  posts,
  className = "",
}: ArticleListProps) {
  let postsArray: StaticPost[] = [];
  
  if (Array.isArray(posts)) {
    postsArray = posts;
  } else if (posts && 'data' in posts && Array.isArray(posts.data)) {
    postsArray = posts.data;
  }

  if (postsArray.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-400">暂无文章</p>
      </div>
    );
  }

  const processedPosts = postsArray.map(processPost);

  const gridClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`;

  return (
    <div className={gridClasses}>
      {processedPosts.map((post) => {
        const formattedDate = post.publishDate
          ? new Date(post.publishDate).toLocaleDateString("zh-CN")
          : "";

        return (
          <ArticleCard
            key={post.id}
            title={post.title}
            date={formattedDate}
            image={post.coverImage}
            slug={post.slug}
          />
        );
      })}
    </div>
  );
}
