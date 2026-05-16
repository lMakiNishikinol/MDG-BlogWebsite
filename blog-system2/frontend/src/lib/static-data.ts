import fs from 'fs';
import path from 'path';

export interface StaticPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishDate: string;
  coverImage: string;
}

export interface PostsIndex {
  posts: StaticPost[];
}

type RawStaticPost = Omit<StaticPost, "id"> & { id?: number };
type RawStaticNotice = Omit<StaticNotice, "id"> & { id?: number };

export interface StrapiResponse {
  data: StaticPost[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function getPostsIndex(): PostsIndex {
  const filePath = path.join(process.cwd(), 'public', 'data', 'posts', 'index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as { posts?: RawStaticPost[] };

  return {
    posts: (parsed.posts || []).map((post, index) => ({
      ...post,
      id: index + 1,
    })),
  };
}

export async function getPosts(params: {
  pagination?: { page?: number; pageSize?: number };
  filters?: Record<string, unknown>;
} = {}): Promise<StrapiResponse> {
  const index = getPostsIndex();
  const posts = [...index.posts].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const page = params.pagination?.page || 1;
  const pageSize = params.pagination?.pageSize || 25;
  const total = posts.length;
  const pageCount = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

/**
 * 按 ID 降序获取最后 N 篇文章（ID 最大的排最前）
 * 专用于主页"最近动态"展示
 */
export function getLatestPostsByIdDesc(count: number = 4): StaticPost[] {
  const index = getPostsIndex();
  const sorted = [...index.posts].sort((a, b) => b.id - a.id);
  return sorted.slice(0, count);
}

export async function getPostBySlug(slug: string): Promise<StaticPost | null> {
  const index = getPostsIndex();
  const post = index.posts.find((p) => p.slug === slug);
  return post || null;
}

export interface RelatedPostItem {
  id: number;
  Title: string;
  Summary: string;
  slug: string;
  Slug: string;
  PublishDate: string;
  CoverImage: string;
}

export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 2
): Promise<RelatedPostItem[]> {
  const index = getPostsIndex();

  const otherPosts = index.posts.filter((post) => post.slug !== currentSlug);

  otherPosts.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return otherPosts.slice(0, limit).map((post) => ({
    id: post.id,
    Title: post.title,
    Summary: post.summary,
    slug: post.slug,
    Slug: post.slug,
    PublishDate: post.publishDate,
    CoverImage: post.coverImage,
  }));
}

export function getStrapiMedia(
  media: string | null | undefined
): string | null {
  if (!media) return null;
  return media;
}

export function getAllPostSlugs(): string[] {
  const index = getPostsIndex();
  return index.posts.map((post) => post.slug);
}

// ==================== Notices ====================

export interface StaticNotice {
  id: number;
  slug: string;
  title: string;
  publishDate: string;
  pinned?: boolean;
}

export interface NoticesIndex {
  notices: StaticNotice[];
}

function getNoticesIndex(): NoticesIndex {
  const filePath = path.join(process.cwd(), 'public', 'data', 'notices', 'index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as { notices?: RawStaticNotice[] };

  return {
    notices: (parsed.notices || []).map((notice, index) => ({
      ...notice,
      id: index + 1,
    })),
  };
}

/** 获取所有通知，置顶优先，然后按日期降序 */
export function getNotices(): StaticNotice[] {
  const index = getNoticesIndex();
  return [...index.notices].sort((a, b) => {
    // 置顶优先
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // 然后按日期降序
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
}

export function getNoticeBySlug(slug: string): StaticNotice | null {
  const index = getNoticesIndex();
  return index.notices.find((n) => n.slug === slug) || null;
}

export function getAllNoticeSlugs(): string[] {
  const index = getNoticesIndex();
  return index.notices.map((n) => n.slug);
}

// ==================== Resources ====================

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
  pinned?: boolean;
}

export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: ResourceItem[];
}

export interface ResourcesIndex {
  categories: ResourceCategory[];
}

export function getResources(): ResourceCategory[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'resources', 'index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const index = JSON.parse(raw) as ResourcesIndex;
  return index.categories;
}
