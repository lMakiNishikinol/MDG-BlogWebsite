# 社团博客系统

**探索人工智能前沿 · 复现经典论文 · 构建学术基础**

基于 Next.js 15 构建的现代化静态博客系统，专为科普与演示设计。

---

## ✨ 特色

- 🎨 **UI**：丰富的动画效果（Parallax、3D卡片、Orbit轨道等）
- 🌓 **暗色模式**：完整的明暗主题切换功能
- 🔍 **全文搜索**：集成 Algolia 搜索引擎
- 📱 **响应式设计**：完美适配各种设备
- ⚡ **纯静态站点**：无需后端服务器，部署简单快速
- 🎯 **零依赖后端**：使用本地 JSON + Markdown 管理内容

---

## 🛠️ 技术栈

### 核心框架

- **[Next.js](https://nextjs.org/)** 15.2 (App Router)
- **[React](https://react.dev/)** 19
- **[TypeScript](https://www.typescriptlang.org/)** 5

### 样式与UI

- **[Tailwind CSS](https://tailwindcss.com/)** 4.x
- **[Geist Font](https://vercel.com/font)** - 现代字体
- **[Framer Motion](https://www.framer.com/motion/)** - 动画库
- **[GSAP](https://gsap.com/)** - 高级动画
- **[Three.js](https://threejs.org/)** - 3D效果
- **[OGL](https://oframe.github.io/ogl/)** - 轻量级WebGL

### 功能组件

- **[Algolia](https://www.algolia.com/)** - 全文搜索
- **[Twikoo](https://twikoo.js.org/)** - 评论系统
- **[KaTeX](https://katex.org/)** - 数学公式渲染
- **[react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** - 代码高亮
- **[Marked](https://marked.js.org/)** - Markdown解析
- **[Zustand](https://zustand-demo.pmnd.rs/)** - 状态管理

### 开发工具

- **ESLint** - 代码检查
- **PostCSS** - CSS处理

---

## 📦 项目结构

```
MDG_website_2/
├── blog-system2/
│   └── frontend/                    # 前端项目根目录
│       ├── public/                  # 静态资源
│       │   ├── data/               # 内容数据
│       │   │   ├── posts/         # 博客文章
│       │   │   │   ├── index.json # 文章索引
│       │   │   │   ├── cover/     # 文章封面图
│       │   │   │   ├── img/       # 文章配图
│       │   │   │   └── *.md       # Markdown文章内容
│       │   │   ├── notices/       # 公告通知
│       │   │   │   ├── index.json # 公告索引
│       │   │   │   └── *.md       # 公告内容
│       │   │   └── resources/     # 学习资源
│       │   ├── HomePageBackground/ # 首页背景图片
│       │   └── favicon.ico        # 网站图标
│       ├── src/
│       │   ├── app/               # Next.js App Router页面
│       │   │   ├── page.tsx       # 首页
│       │   │   ├── layout.tsx     # 根布局
│       │   │   ├── posts/         # 文章列表页
│       │   │   ├── about/         # 关于页面
│       │   │   ├── notices/       # 公告页面
│       │   │   └── resources/     # 资源页面
│       │   ├── components/        # React组件
│       │   │   ├── Home/          # 首页特效组件
│       │   │   ├── Search/        # 搜索组件
│       │   │   ├── theme/         # 主题切换
│       │   │   └── ...            # 其他组件
│       │   └── lib/               # 工具库
│       │       ├── static-data.ts # 静态数据读取
│       │       └── utils.ts       # 通用工具函数
│       ├── next.config.js         # Next.js配置
│       ├── tailwind.config.mjs    # Tailwind配置
│       ├── package.json           # 项目依赖
│       └── tsconfig.json          # TypeScript配置
└── README.md                      # 项目文档
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18.x 或更高版本
- **npm** / **yarn** / **pnpm** 包管理器

### 安装依赖

**1. 项目依赖**

```bash
cd blog-system2/frontend
npm install
# 或
yarn install
# 或
pnpm install
```

**2. EdgeOne CLI（用于本地预览和部署）**

```bash
npm install -g edgeone
```

验证安装：

```bash
edgeone -v    # 查看版本号
edgeone -h    # 查看所有可用命令
```

### 开发模式启动

**方式一：EdgeOne Pages 本地预览**

```bash
edgeone pages dev
```

启动后访问 [http://localhost:8088](http://localhost:8088)

> 支持热更新、Pages函数调试、环境变量同步等功能

> **注意**：避免频繁退出启动 dev 服务（dev 服务内热更新不会增加启动次数）

**方式二：Next.js 标准开发服务器**

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

启动后访问 [http://localhost:3000](http://localhost:3000)

---

## ⚙️ 配置说明（正常情况下不动）

### 环境变量 (.env.local)

在 `blog-system2/frontend/` 目录下创建 `.env.local` 文件：

```env
# ========================
# 🔍 Algolia 搜索配置（可选）
# ========================
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts
```

> **注意**：
>
> - 所有以 `NEXT_PUBLIC_` 开头的变量会暴露给浏览器
> - 如果不使用搜索功能，可以不配置这些变量
> - 本项目为**纯前端静态站点**，无需配置Strapi后端

### 图片域名配置

编辑 [next.config.js](blog-system2/frontend/next.config.js) 中的 `images.domains`：

```javascript
images: {
  domains: [
    "localhost",
    "127.0.0.1",
    "cdn.wuyilin18.top",      // CDN域名（根据实际情况修改）
    "cdn.jsdelivr.net",
    "api.wuyilin18.top",      // API域名（根据实际情况修改）
  ],
}
```

---

## 📝 内容管理

本项目采用**本地文件系统**管理内容，无需数据库或后端服务。

### 添加新文章

1. **编写Markdown文件**

   在 `public/data/posts/` 目录下创建 `.md` 文件，例如 `my-new-post.md`：

   ```markdown
   # 文章正文开始

   这里使用标准Markdown语法编写内容...

   ## 支持的功能

   - **数学公式**：$E=mc^2$
   - **代码高亮**：
     ```python
     print("Hello, World!")
       ```
   - **图片插入**：![描述](./img/1.png)
   ```
2. **添加封面图片**

   将封面图片放入 `public/data/posts/cover/` 目录
3. **更新文章索引**

   编辑 [public/data/posts/index.json](blog-system2/frontend/public/data/posts/index.json)，在 `posts` 数组中添加新条目：

   ```json
   {
     "slug": "my-new-post",
     "title": "我的新文章标题",
     "summary": "文章摘要描述",
     "publishDate": "2026-01-01",
     "coverImage": "/data/posts/cover/my-cover.png"
   }
   ```
4. **添加文章配图**（可选）

   在 `public/data/posts/img/` 下创建对应目录存放图片

### 添加公告

1. 编写Markdown文件到 `public/data/notices/`
2. 更新 [public/data/notices/index.json](blog-system2/frontend/public/data/notices/index.json)

### 添加学习资源

更新 [public/data/resources/index.json](blog-system2/frontend/public/data/resources/index.json)

---

## 🏗️ 构建与部署

### 构建生产版本

```bash
# 标准构建（生成静态文件）
npm run build

# GitHub Pages专用构建
npm run build:github
```

构建产物输出到 `out/` 目录

### 部署方式

#### 方式一：EdgeOne Pages

使用腾讯云 EdgeOne Pages 部署，支持本地预览和一键部署。

**准备工作**

1. 使用 Gmail 邮箱注册登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 在控制台开通 [Pages 服务](https://console.cloud.tencent.com/tcb/pages)
3. 创建新的 Pages 项目

> **提示**：如未安装 EdgeOne CLI，请参考上方「安装依赖」部分的安装说明

**登录 EdgeOne（首次使用需要登录）**

```bash
edgeone login
```

- 选择 `Global`（国际站）或 `China`（中国站），建议选择 Global
- 在弹出的浏览器窗口完成登录

查看当前账号信息：

```bash
edgeone whoami
```

**初始化项目（首次使用）**

```bash
cd blog-system2/frontend
edgeone pages init
```

初始化后会生成 EdgeOne Pages 需要的基础环境配置。

**🚀 构建并部署到生产环境**

```bash
cd blog-system2/frontend

# 步骤1：构建项目
npm run build

# 步骤2：部署到 EdgeOne Pages（自动构建+部署）
edgeone pages deploy ./out -n mdg-blog
```

参数说明：

- `./out`：构建产物目录（必填）
- `-n mdg-blog`：项目名称（必填，不存在则自动创建）
- `-e production`：部署到生产环境（默认）
- `-e preview`：部署到预览环境

**其他命令（比较少用）**

```bash
# 部署到预览环境
edgeone pages deploy ./out -n mdg-blog -e preview

# 仅部署（不重新构建，需确保 out 目录存在）
edgeone pages deploy ./out -n mdg-blog

# 切换账号
edgeone switch
```

#### 方式二：GitHub Pages

1. 推送代码到GitHub仓库
2. 设置 GitHub Pages：
   - 进入仓库 Settings → Pages
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，目录选择 `/ (root)`
3. 使用专用构建命令：

```bash
npm run build:github
```

#### 方式三：Vercel

1. 推送代码到GitHub
2. 导入项目到 [Vercel](https://vercel.com/)
3. 自动部署，无需额外配置

#### 方式四：任意静态托管

将 `out/` 目录上传到任意支持静态文件的托管服务（Netlify、Cloudflare Pages等）

---

## 🎨 主要功能模块

### 🏠 首页

- 视差滚动背景效果
- 3D卡片交互展示
- Orbit轨道动画
- 最新文章展示
- 最新公告预览

### 📚 文章系统

- 文章列表（分页）
- 文章详情页（Markdown渲染）
- 目录导航（TOC）
- 相关文章推荐
- 阅读时间估算
- 作者信息展示

### 🔍 搜索功能

- Algolia全文搜索
- 实时搜索建议
- 搜索结果高亮

### 📢 公告系统

- 公告列表
- 公告详情

### 👥 关于页面

- 团队介绍
- 日程安排日历

### 🌓 主题切换

- 明亮/暗色模式
- 系统主题跟随
- 平滑过渡动画

---

## 🙏 致谢

- 感谢原项目 [BlogWebsite-Eighteen](https://github.com/wuyilin18/BlogWebsite-Eighteen) 提供的基础架构
- 感谢所有开源社区提供的优秀组件和工具
