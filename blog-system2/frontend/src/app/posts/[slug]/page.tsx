import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from "@/lib/static-data";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/post/TableOfContents";
import { ArticleTimeline } from "@/components/post/ArticleTimeline";
import { calculateMarkdownReadingStats } from "@/lib/reading-time";
import Image from "next/image";
import fs from "fs";
import path from "path";

type Params = {
  slug: string;
};

function getPostContent(slug: string): string {
  try {
    const postsDirectory = path.join(process.cwd(), "public/data/posts");
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return "";
  } catch {
    return "";
  }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "文章不存在",
      description: "找不到请求的文章",
    };
  }

  return {
    title: `${post.title} | 论文复现组`,
    description: post.summary || post.title,
    openGraph: {
      title: `${post.title} | 论文复现组`,
      description: post.summary || post.title,
    },
  };
}

export const dynamic = "force-static";

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const title = post.title || "无标题";
  const summary = post.summary || "";
  const publishDate = post.publishDate || "";
  const postContent = getPostContent(post.slug);
  const { wordCount, readingTime } = calculateMarkdownReadingStats(postContent);

  const coverImageUrl = post.coverImage || "https://cdn.wuyilin18.top/img/7245943.png";

  const currentSlug = post.slug;

  const relatedPosts = await getRelatedPosts(currentSlug, 2);

  return (
    <div className="min-h-screen w-full pt-20 md:pt-32 pb-20 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
      `,
        }}
      />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto toc-layout-wrapper">
          <div className="flex-1 min-w-0">
            <ArticleTimeline>
              <div
                id="article-content"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-8 md:p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
                style={{
                  animationDelay: "0.3s",
                  boxShadow:
                    "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid rgba(150, 150, 150, 0.1)",
                }}
              >
                <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

                <div className="mb-8 relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] animate-float-up">
                    {title}
                  </h1>

                  <div
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 mb-4 animate-float-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {publishDate && (
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        发布于{" "}
                        {new Date(publishDate).toLocaleDateString("zh-CN")}
                      </span>
                    )}

                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      字数: {wordCount} 字
                    </span>

                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      阅读: 约 {readingTime} 分钟
                    </span>
                  </div>


                </div>

                {coverImageUrl && (
                  <div
                    className="mb-10 rounded-xl overflow-hidden shadow-lg animate-scale-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <PostImage src={coverImageUrl} alt={title || "文章封面"} />
                  </div>
                )}

                {summary && (
                  <div
                    className="mb-10 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl border-l-4 border-green-500 dark:border-green-400 animate-float-up"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                <div
                  className="prose prose-lg dark:prose-invert max-w-none animate-float-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="relative">
                    {postContent ? (
                      <MarkdownRenderer content={postContent} slug={post.slug} />
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 italic text-center py-12">
                        文章内容加载中...
                      </div>
                    )}
                  </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                      相关文章
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/posts/${relatedPost.slug}/`}
                          className="cursor-target group"
                        >
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                            {relatedPost.CoverImage && (
                              <div className="mb-3 rounded-lg overflow-hidden h-32">
                                <Image
                                  src={relatedPost.CoverImage}
                                  alt={relatedPost.Title || ""}
                                  width={400}
                                  height={200}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#56cfe1] transition-colors">
                              {relatedPost.Title}
                            </h4>
                            {relatedPost.Summary && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                {relatedPost.Summary}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-gray-500 dark:text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="text-sm">硅原游牧 · 云端数字史诗</span>
                  </div>
                </div>
              </div>
            </ArticleTimeline>
          </div>

          <TableOfContents />
        </div>
      </div>
    </div>
  );
}
