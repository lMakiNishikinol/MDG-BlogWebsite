import { Metadata } from "next";
import { getPosts, StaticPost } from "@/lib/static-data";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "分享会文章 | 论文复现组",
  description: "浏览所有博客文章",
};

export const dynamic = "force-static";

export default async function PostsPage() {
  const postsData = await getPosts();
  const posts = postsData.data;

  return (
    <div className="min-h-screen w-full pt-20 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
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
        .article-card {
          transition: all 0.3s ease;
          position: relative;
          backface-visibility: hidden;
        }
        .article-card:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 5;
        }
        .article-appear {
          opacity: 0;
          transform: translateY(30px);
          animation: floatUp 0.8s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
      `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-2 sm:px-4 md:px-10 lg:px-16">
        <div
          className="text-center mb-12 opacity-0 animate-float-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] inline-block relative">
            分享会文章
            <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a5a5a] dark:text-[#b0b0b0]">
              硅原游牧
            </span>
          </h1>
          <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
            在硅原的极夜里点亮函数，于参数的极昼中焊接星光。
          </p>
        </div>

        <div className="flex justify-center items-center">
          
        </div>

        {!posts || posts.length === 0 ? (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
            style={{
              animationDelay: "0.3s",
              boxShadow:
                "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(150, 150, 150, 0.1)",
            }}
          >
            <div className="text-center relative z-10">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                暂无文章
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                敬请期待更多精彩内容
              </p>
            </div>
          </div>
        ) : (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
            style={{
              animationDelay: "0.3s",
              boxShadow:
                "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(150, 150, 150, 0.1)",
            }}
          >
            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
              {posts.map((post: StaticPost, index: number) => {
                return (
                  <div
                    key={post.id}
                    className="article-card article-appear"
                    style={
                      {
                        "--delay": `${0.1 + index * 0.1}s`,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="article-card-container bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 relative group"
                      style={{
                        background:
                          index % 3 === 0
                            ? "rgba(80, 120, 86, 0.02)"
                            : "rgba(80, 80, 80, 0.02)",
                        borderColor:
                          index % 3 === 0
                            ? "rgba(80, 120, 86, 0.1)"
                            : "rgba(80, 80, 80, 0.1)",
                        boxShadow:
                          "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <ArticleCard
                        title={post.title || "无标题"}
                        date={
                          post.publishDate
                            ? new Date(post.publishDate).toLocaleDateString(
                                "zh-CN"
                              )
                            : ""
                        }
                        image={post.coverImage}
                        slug={post.slug}
                        noShadow={true}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-float-up"
          style={{ animationDelay: "0.7s" }}
        >
          探索硅原游牧的数字史诗 · 点击文章卡片阅读详情
        </div>
      </div>
    </div>
  );
}
