"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface HeadingData {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  parentId?: string;
  children: string[];
}

interface TocNode {
  heading: HeadingData;
  children: TocNode[];
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  // 手动展开的 section（用户主动点击展开/折叠的）
  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set());
  // 自动展开的 section（滚动触发的）
  const [autoExpanded, setAutoExpanded] = useState<Set<string>>(new Set());
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  // 构建嵌套树结构
  const buildTree = useCallback((list: HeadingData[]): TocNode[] => {
    const roots: TocNode[] = [];
    const stack: TocNode[] = [];

    list.forEach((h) => {
      const node: TocNode = { heading: h, children: [] };
      while (stack.length > 0 && stack[stack.length - 1].heading.level >= h.level) {
        stack.pop();
      }
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        h.parentId = parent.heading.id;
        parent.heading.children.push(h.id);
        parent.children.push(node);
      } else {
        roots.push(node);
      }
      stack.push(node);
    });

    return roots;
  }, []);

  // 提取标题
  const extractHeadings = useCallback(() => {
    const articleContent = document.getElementById("article-content");
    if (!articleContent) return;

    const elements = articleContent.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const list: HeadingData[] = Array.from(elements)
      .map((el, index) => {
        const element = el as HTMLElement;
        if (
          element.textContent?.includes("留言板") ||
          element.closest('[id*="comment"]') ||
          element.closest('[class*="comment"]')
        ) return null;

        const text = element.textContent?.trim() || "";
        if (!text) return null;

        const id = element.id || `heading-${index}`;
        if (!element.id) element.id = id;

        return { id, text, level: parseInt(element.tagName.charAt(1)), element, children: [] as string[] };
      })
      .filter((h): h is HeadingData => h !== null);

    setHeadings(list);
    if (list.length > 0 && !activeId) {
      setActiveId(list[0].id);
    }
  }, [activeId]);

  // 获取标题的所有祖先 ID
  const getAncestorIds = useCallback((headingId: string, list: HeadingData[]): string[] => {
    const ancestors: string[] = [];
    const h = list.find((x) => x.id === headingId);
    if (!h) return ancestors;
    let current = h;
    while (current.parentId) {
      ancestors.push(current.parentId);
      const parent = list.find((x) => x.id === current.parentId);
      if (!parent) break;
      current = parent;
    }
    return ancestors;
  }, []);

  // 是否展开（手动或自动均算）
  const isExpanded = useCallback((id: string) => {
    return manualExpanded.has(id) || autoExpanded.has(id);
  }, [manualExpanded, autoExpanded]);

  useEffect(() => { setMounted(true); }, []);

  // 收起大纲时扩展文章容器宽度
  useEffect(() => {
    const wrapper = document.querySelector('.toc-layout-wrapper') as HTMLElement | null;
    if (!wrapper) return;

    if (sidebarCollapsed) {
      // 仅移除 wrapper 的 max-w-7xl (1280px)，保留外层 container (1536px) 约束
      wrapper.classList.remove('max-w-7xl');
      wrapper.style.maxWidth = 'none';
    } else {
      wrapper.classList.add('max-w-7xl');
      wrapper.style.maxWidth = '';
    }

    return () => {
      wrapper.classList.add('max-w-7xl');
      wrapper.style.maxWidth = '';
    };
  }, [sidebarCollapsed]);

  // 初始化 + 滚动监听
  useEffect(() => {
    const timer = setTimeout(extractHeadings, 500);

    const observer = new MutationObserver(() => {
      setTimeout(extractHeadings, 300);
    });
    const articleContent = document.getElementById("article-content");
    if (articleContent) {
      observer.observe(articleContent, { childList: true, subtree: true, characterData: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [extractHeadings]);

  // 滚动监听
  useEffect(() => {
    if (headings.length === 0) return;

    let ticking = false;
    const onScroll = () => {
      const scrollPos = window.scrollY + 150;
      let currentId = "";

      for (const h of headings) {
        if (h.element.offsetTop <= scrollPos) {
          currentId = h.id;
        } else {
          break;
        }
      }

      // 滚动到底部时激活最后一个
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && headings.length > 0) {
        currentId = headings[headings.length - 1].id;
      }

      if (!currentId && window.scrollY < 100 && headings.length > 0) {
        currentId = headings[0].id;
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, activeId]);

  // activeId 变化时自动展开/收起
  useEffect(() => {
    if (!activeId || headings.length === 0) return;

    const ancestors = getAncestorIds(activeId, headings);
    const needExpand = new Set(ancestors);
    // 当前标题自身如果有子项也展开
    const current = headings.find((h) => h.id === activeId);
    if (current && current.children.length > 0) {
      needExpand.add(activeId);
    }

    setAutoExpanded(needExpand);
  }, [activeId, headings, getAncestorIds]);

  // 自动滚动 TOC 到激活项
  useEffect(() => {
    if (activeId && activeLinkRef.current && tocContainerRef.current) {
      const container = tocContainerRef.current;
      const el = activeLinkRef.current;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const relTop = eRect.top - cRect.top;
      const isVisible = relTop >= 20 && eRect.bottom - cRect.top <= container.clientHeight - 20;
      if (!isVisible) {
        container.scrollTo({
          top: container.scrollTop + relTop - container.clientHeight / 2 + eRect.height / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: "smooth" });
      setActiveId(id);
    }
  };

  const toggleManualExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setManualExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const tree = buildTree(headings);

  // 递归渲染 TOC 节点
  const renderNode = (node: TocNode): React.ReactNode => {
    const h = node.heading;
    const isActive = activeId === h.id;
    const hasChildren = node.children.length > 0;
    const expanded = isExpanded(h.id);

    return (
      <li key={h.id} className="toc-item" data-heading-id={h.id}>
        <div className="toc-item-wrapper">
          {hasChildren ? (
            <button
              className={`toc-toggle ${expanded ? "expanded" : ""}`}
              onClick={(e) => toggleManualExpand(h.id, e)}
              title="展开/折叠"
            >
              ▶
            </button>
          ) : (
            <span className="toc-toggle-placeholder" />
          )}
          <a
            ref={isActive ? activeLinkRef : null}
            className={`toc-link cursor-target level-${h.level} ${isActive ? "active" : ""}`}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(h.id);
              if (hasChildren) {
                setManualExpanded((prev) => new Set(prev).add(h.id));
              }
            }}
          >
            {h.text}
          </a>
        </div>
        {hasChildren && (
          <ul className={`toc-children ${expanded ? "expanded" : ""}`}>
            {node.children.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  // 侧栏收起时的浮动展开按钮（portal 到 body 确保 fixed 定位不被祖先元素影响）
  const expandButton = sidebarCollapsed && mounted ? createPortal(
    <button
      className="toc-expand-btn cursor-target visible"
      onClick={() => setSidebarCollapsed(false)}
      title="展开大纲"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </button>,
    document.body
  ) : null;

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <style>{tocStyles}</style>
      {expandButton}
      <aside className={`toc-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="toc-header">
          <span className="toc-title">📑 文章目录</span>
          <button
            className="toc-collapse-btn cursor-target"
            onClick={() => setSidebarCollapsed(true)}
            title="收起大纲"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div ref={tocContainerRef} className="toc-list-container">
          <ul className="toc-list">
            {tree.map(renderNode)}
          </ul>
        </div>

        <div className="toc-footer">
          <span>共 {headings.length} 个标题</span>
          <div className="toc-progress-bar">
            <div
              className="toc-progress-fill"
              style={{
                width: `${headings.length > 0
                  ? ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                  : 0}%`,
              }}
            />
          </div>
          <span className="toc-progress-text">
            {headings.findIndex((h) => h.id === activeId) + 1} / {headings.length}
          </span>
        </div>
      </aside>
    </>
  );
};

const tocStyles = `
  .toc-sidebar {
    position: sticky;
    top: 8rem;
    width: 280px;
    max-height: calc(100vh - 10rem);
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    border: 1px solid rgba(150, 150, 150, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: width 0.35s ease, opacity 0.3s ease, padding 0.35s ease, margin 0.35s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 40;
  }

  .dark .toc-sidebar {
    background: rgba(31, 41, 55, 0.6);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .toc-sidebar.collapsed {
    width: 0;
    padding: 0;
    opacity: 0;
    margin-left: -2rem;
    border: none;
    pointer-events: none;
    overflow: hidden;
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(150, 150, 150, 0.12);
    flex-shrink: 0;
  }

  .dark .toc-header {
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }

  .toc-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #374151;
  }

  .dark .toc-title {
    color: #e5e7eb;
  }

  .toc-collapse-btn {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .toc-collapse-btn:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }

  .dark .toc-collapse-btn:hover {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.1);
  }

  .toc-expand-btn {
    position: fixed;
    right: 24px;
    top: 9rem;
    z-index: 50;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(150, 150, 150, 0.2);
    color: #6b7280;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    pointer-events: none;
    transform: translateX(20px);
  }

  .dark .toc-expand-btn {
    background: rgba(31, 41, 55, 0.85);
    border-color: rgba(255, 255, 255, 0.1);
    color: #9ca3af;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .toc-expand-btn.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }

  .toc-expand-btn:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
    transform: scale(1.08);
  }

  .dark .toc-expand-btn:hover {
    color: #60a5fa;
    border-color: #60a5fa;
    box-shadow: 0 4px 16px rgba(96, 165, 250, 0.2);
  }

  .toc-list-container {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .toc-list-container::-webkit-scrollbar {
    display: none;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-item {
    margin-bottom: 1px;
  }

  .toc-item-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .toc-toggle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 0.6rem;
    border-radius: 4px;
    transition: all 0.25s ease;
    flex-shrink: 0;
    margin-left: 6px;
  }

  .toc-toggle:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  .dark .toc-toggle:hover {
    background: rgba(96, 165, 250, 0.1);
    color: #60a5fa;
  }

  .toc-toggle.expanded {
    transform: rotate(90deg);
  }

  .toc-toggle-placeholder {
    width: 20px;
    flex-shrink: 0;
    margin-left: 6px;
  }

  .toc-link {
    display: block;
    flex: 1;
    color: #6b7280;
    text-decoration: none;
    padding: 0.35rem 0.7rem;
    border-radius: 6px;
    transition: all 0.25s ease;
    font-size: 0.85rem;
    line-height: 1.4;
    border-left: 2px solid transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 6px;
  }

  .dark .toc-link {
    color: #9ca3af;
  }

  .toc-link:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.06);
    border-left-color: rgba(59, 130, 246, 0.3);
  }

  .dark .toc-link:hover {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.06);
    border-left-color: rgba(96, 165, 250, 0.3);
  }

  .toc-link.active {
    color: #2563eb;
    background: rgba(59, 130, 246, 0.08);
    border-left-color: #2563eb;
    font-weight: 600;
  }

  .dark .toc-link.active {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.1);
    border-left-color: #60a5fa;
  }

  .toc-link.level-1 { font-size: 0.9rem; font-weight: 600; }
  .toc-link.level-2 { font-size: 0.85rem; }
  .toc-link.level-3 { font-size: 0.82rem; }
  .toc-link.level-4 { font-size: 0.78rem; opacity: 0.85; }

  .toc-children {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-left: 0.6rem;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.35s ease, opacity 0.25s ease;
  }

  .toc-children.expanded {
    max-height: 2000px;
    opacity: 1;
  }

  .toc-footer {
    flex-shrink: 0;
    padding: 0.6rem 1rem;
    border-top: 1px solid rgba(150, 150, 150, 0.12);
    font-size: 0.72rem;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dark .toc-footer {
    border-top-color: rgba(255, 255, 255, 0.08);
    color: #6b7280;
  }

  .toc-progress-bar {
    flex: 1;
    height: 3px;
    background: rgba(150, 150, 150, 0.15);
    border-radius: 2px;
    overflow: hidden;
  }

  .dark .toc-progress-bar {
    background: rgba(255, 255, 255, 0.08);
  }

  .toc-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .dark .toc-progress-fill {
    background: linear-gradient(90deg, #60a5fa, #93c5fd);
  }

  .toc-progress-text {
    white-space: nowrap;
  }

  @media (max-width: 1280px) {
    .toc-sidebar {
      display: none;
    }
    .toc-expand-btn {
      display: none;
    }
  }
`;
