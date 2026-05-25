"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { marked } from "marked";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import katex from "katex";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "framer-motion";
import mermaid from "mermaid"

interface MarkdownRendererProps {
  content: string;
  className?: string;
  slug?: string;
}

const markdownStyles = `
  .markdown-content {
    --text-primary: #2c3e50;
    --text-secondary: #64748b;
    --primary-color: #2563eb;
    --secondary-color: #d97706;
    --accent-color: #7c3aed;
    --border-color: #e2e8f0;
    --code-bg: rgba(37, 99, 235, 0.07);
    --code-header-bg: rgba(37, 99, 235, 0.06);
    --blockquote-bg: rgba(217, 119, 6, 0.05);
    --table-bg: rgba(0, 0, 0, 0.02);
    --table-header-bg: rgba(37, 99, 235, 0.06);
    --code-block-bg: #fafbfc;
    --code-header-bg: #f1f5f9;
    --img-hover-shadow: rgba(37, 99, 235, 0.25);
    color: var(--text-primary);
    line-height: 1.7;
  }

  .dark .markdown-content {
    --text-primary: #e2e8f0;
    --text-secondary: #94a3b8;
    --primary-color: #60a5fa;
    --secondary-color: #fb923c;
    --accent-color: #a78bfa;
    --border-color: rgba(255, 255, 255, 0.1);
    --code-bg: rgba(96, 165, 250, 0.1);
    --code-header-bg: rgba(30, 35, 60, 0.9);
    --blockquote-bg: rgba(251, 146, 60, 0.06);
    --table-bg: rgba(255, 255, 255, 0.02);
    --table-header-bg: rgba(96, 165, 250, 0.1);
    --code-block-bg: #0d1117;
    --img-hover-shadow: rgba(96, 165, 250, 0.3);
  }

  .markdown-content h1 {
    font-size: 2rem;
    margin-bottom: 1.2rem;
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
  }

  .markdown-content h2 {
    font-size: 1.6rem;
    margin-top: 2rem;
    margin-bottom: 0.8rem;
    color: var(--primary-color);
    border-left: 5px solid var(--primary-color);
    padding-left: 1rem;
  }

  .markdown-content h3 {
    font-size: 1.3rem;
    margin-top: 1.6rem;
    margin-bottom: 0.7rem;
    color: var(--accent-color);
  }

  .markdown-content h4 {
    font-size: 1.1rem;
    margin-top: 1.4rem;
    margin-bottom: 0.6rem;
    color: var(--secondary-color);
  }

  .markdown-content p {
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .markdown-content ul {
    margin-bottom: 1.2rem;
    padding-left: 2rem;
    list-style-type: disc;
  }

  .markdown-content ol {
    margin-bottom: 1.2rem;
    padding-left: 2rem;
    list-style-type: decimal;
  }

  .markdown-content li {
    margin-bottom: 0.4rem;
    display: list-item;
  }

  .markdown-content code:not(pre code) {
    background: var(--code-bg);
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    color: var(--primary-color);
    font-size: 0.9em;
  }

  .markdown-content .code-block-wrapper {
    margin-bottom: 1.2rem;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--code-block-bg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .markdown-content .code-block-wrapper:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }

  .dark .markdown-content .code-block-wrapper:hover {
    box-shadow: 0 4px 20px rgba(96, 165, 250, 0.15);
  }

  .markdown-content .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--code-header-bg);
    border-bottom: 1px solid var(--border-color);
    font-family: "Consolas", "Monaco", monospace;
    font-size: 0.85rem;
    color: var(--text-secondary);
    user-select: none;
  }

  .markdown-content .code-lang {
    font-weight: bold;
    color: var(--primary-color);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .markdown-content .code-line-count {
    font-weight: normal;
    font-size: 0.78rem;
    color: var(--text-secondary);
    opacity: 0.7;
    text-transform: none;
  }

  .markdown-content .code-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .markdown-content .code-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .markdown-content .code-btn:hover {
    color: var(--primary-color);
    background: var(--code-bg);
  }

  .markdown-content .code-body {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    max-height: 4000px;
    opacity: 1;
  }

  .markdown-content .code-body.collapsed {
    max-height: 0;
    opacity: 0;
  }

  .markdown-content .collapse-icon {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .markdown-content .collapse-hint {
    text-align: center;
    padding: 0.4rem;
    font-size: 0.78rem;
    color: var(--text-secondary);
    opacity: 0.6;
    cursor: pointer;
    transition: opacity 0.2s ease;
    display: none;
  }

  .markdown-content .collapse-hint.visible {
    display: block;
  }

  .markdown-content .collapse-hint:hover {
    opacity: 1;
    color: var(--primary-color);
  }

  .markdown-content blockquote {
    border-left: 4px solid var(--secondary-color);
    padding-left: 1.5rem;
    margin: 1.2rem 0;
    color: var(--text-secondary);
    font-style: italic;
    background: var(--blockquote-bg);
    padding: 0.9rem 1.3rem;
    border-radius: 0 10px 10px 0;
  }

  .markdown-content a {
    color: var(--primary-color);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }

  .markdown-content a:hover {
    color: var(--secondary-color);
    border-bottom-color: var(--secondary-color);
  }

  .markdown-content img {
    max-width: 100%;
    max-height: 40vh;
    display: block;
    margin: 1.5rem auto;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    cursor: zoom-in;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .markdown-content img:hover {
    transform: scale(1.01);
    box-shadow: 0 8px 25px var(--img-hover-shadow);
  }

  .markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2rem 0;
    background: var(--table-bg);
    border-radius: 10px;
    overflow: hidden;
  }

  .markdown-content th,
  .markdown-content td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  .markdown-content th {
    background: var(--table-header-bg);
    color: var(--primary-color);
    font-weight: bold;
  }

  .markdown-content hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary-color), var(--secondary-color), transparent);
    margin: 1.5rem 0;
  }

  .markdown-content strong {
    color: var(--text-primary);
    font-weight: 700;
  }

  .markdown-content em {
    color: var(--accent-color);
    font-style: italic;
  }

  .markdown-content input[type="checkbox"] {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  /* 图片灯箱效果 - 由 Framer Motion 控制，仅保留基础样式 */
  .markdown-content img {
    cursor: zoom-in;
  }

  .dark .markdown-content {
    --text-primary: #fff;
    --text-secondary: #94a3b8;
    --border-color: rgba(255, 255, 255, 0.1);
  }

  /* 防止 Tailwind prose 给代码块内元素注入额外样式 */
  .markdown-content .code-block-wrapper code::before,
  .markdown-content .code-block-wrapper code::after {
    content: none !important;
  }
  .markdown-content .code-block-wrapper pre,
  .markdown-content .code-block-wrapper pre code {
    background: transparent !important;
    color: inherit !important;
    border-radius: 0 !important;
  }

  .markdown-content .video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 1.5rem 0;
}

.markdown-content .video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.markdown-content .html-block-wrapper {
  margin-bottom: 1.2rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--code-block-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.markdown-content .html-block-wrapper:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.dark .markdown-content .html-block-wrapper:hover {
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.15);
}

.markdown-content .html-block-wrapper .html-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--code-header-bg);
  border-bottom: 1px solid var(--border-color);
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  user-select: none;
}

.markdown-content .html-block-wrapper .html-lang {
  font-weight: bold;
  color: var(--primary-color);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.markdown-content .html-block-wrapper .html-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.markdown-content .html-block-wrapper .html-body > div {
  overflow: hidden;
}

.markdown-content .html-block-wrapper .html-body > div {
  overflow: hidden;
}

.markdown-content .html-block-wrapper .html-body.expanded {
  grid-template-rows: 1fr;
}

.markdown-content .html-block-wrapper .html-body.expanded iframe {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.markdown-content .html-block-wrapper .html-body.expanded iframe::-webkit-scrollbar {
  display: none;
}

.markdown-content .html-block-wrapper .expand-hint {
  text-align: center;
  padding: 0.4rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.markdown-content .html-block-wrapper .expand-hint:hover {
  opacity: 1;
  color: var(--primary-color);
}
`;



interface CodeBlockProps {
  language: string;
  children: string;
}
//渲染代码块
const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const [copied, setCopied] = useState(false);
  const lineCount = children.split("\n").length;
  const shouldCollapse = lineCount > 20;
  const [collapsed, setCollapsed] = useState(shouldCollapse);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper not-prose cursor-target">
      <div className="code-header">
        <span className="code-lang">
          <span style={{ opacity: 0.7 }}>&lt;/&gt;</span> {language || "TEXT"}
          <span className="code-line-count">{lineCount} 行</span>
        </span>
        <div className="code-actions">
          <button className="code-btn copy-btn" onClick={handleCopy}>
            {copied ? "✅ 已复制" : "📋 复制"}
          </button>
          {shouldCollapse && (
            <button
              className="code-btn collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "展开代码" : "折叠代码"}
            >
              <span className="collapse-icon" style={{ transform: collapsed ? "rotate(-90deg)" : "" }}>▼</span>
            </button>
          )}
        </div>
      </div>
      <div className={`code-body ${collapsed ? "collapsed" : ""}`}>
        <SyntaxHighlighter
          language={language || "text"}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.88rem",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      {shouldCollapse && collapsed && (
        <div
          className="collapse-hint visible"
          onClick={() => setCollapsed(false)}
        >
          ··· 点击展开 {lineCount} 行代码 ···
        </div>
      )}
    </div>
  );
};

interface HtmlBlockProps {
  src: string;
}

const HtmlBlock: React.FC<HtmlBlockProps> = ({ src }) => {
  const [expanded, setExpanded] = useState(false);
  const fileName = src.replace(/^\\data\\posts\\img\\\d+/, "").split("/").pop()?.replace(/\.html$/, "") || "HTML";

  return (
    <div className="html-block-wrapper not-prose cursor-target">
      <div className="html-header">
        <span className="html-lang">
          <span style={{ opacity: 0.7 }}>&lt;/&gt;</span> {fileName}
        </span>
        <button
          className="code-btn"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "收起" : "展开"}
        >
          {expanded ? "收起" : "展开"}
        </button>
      </div>
      <div className={`html-body ${expanded ? "expanded" : ""}`}>
        <div>
          <iframe
            src={src}
            style={{ width: "100%", height: "100vh", border: "none" }}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
      {!expanded && (
        <div className="expand-hint" onClick={() => setExpanded(true)}>
          ··· 点击展开内容 ···
        </div>
      )}
    </div>
  );
};

const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    const language = lang || "";
    return `<code-block data-language="${language}" data-code="${encodeURIComponent(text)}"></code-block>`;
  },
};

marked.use({ renderer });
// md渲染器
export default function MarkdownRenderer({
  content,
  className = "",
  slug = "",
}: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    mermaid.initialize({ 
      startOnLoad: true, 
      securityLevel: 'strict',
    });
    mermaid.contentLoaded();
  }, []);

  const openLightbox = useCallback((src: string) => {
    window.dispatchEvent(new Event("cursor:release"));
    setLightboxImage(src);
  }, []);

  const closeLightbox = useCallback(() => {
    window.dispatchEvent(new Event("cursor:release"));
    setLightboxImage(null);
  }, []);

  // ESC 关闭 + 阻止 body 滚动
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [lightboxImage, closeLightbox]);

  const renderedContent = useMemo(() => {
    if (!content) return "";

    const mathBlocks: string[] = [];
    const mathInlines: string[] = [];
    const mermaidBlocks: string[] = [];
    const videoBlocks: string[] = [];
    const htmlBlocks: string[] = [];



    let protectedText = content.replace(
      /```mermaid\r?\n([\s\S]*?)```/g,
      (match, formula) => {
        mermaidBlocks.push(formula);
        return `<!--MERMAID_${mermaidBlocks.length - 1}-->`;
      }
    );

    protectedText = protectedText.replace(
      /```html\r?\n([\s\S]*?)```/g,
      (match, formula) => {
        htmlBlocks.push(formula);
        return `<!--HTML_${htmlBlocks.length - 1}-->`;
      }
    );

    protectedText = protectedText.replace(
      /```video\r?\n([\s\S]*?)```/g,
      (match, formula) => {
        videoBlocks.push(formula);
        return `<!--VIDEO_${videoBlocks.length - 1}-->`;
      }
    );

    protectedText = protectedText.replace(
      /\$\$([\s\S]+?)\$\$/g,
      (match, formula) => {
        mathBlocks.push(formula);
        return `<!--MATH_BLOCK_${mathBlocks.length - 1}-->`;
      }
    );

    protectedText = protectedText.replace(
      /\$([^\$\n]+?)\$/g,
      (match, formula) => {
        mathInlines.push(formula);
        return `<!--MATH_INLINE_${mathInlines.length - 1}-->`;
      }
    );

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    let html = marked.parse(protectedText) as string;
    

    html = html.replace(/<!--MATH_BLOCK_(\d+)-->/g, (match, index) => {
      try {
        return katex.renderToString(mathBlocks[parseInt(index)], {
          displayMode: true,
          throwOnError: false,
        });
      } catch {
        return `<pre class="katex-error">${mathBlocks[parseInt(index)]}</pre>`;
      }
    });

    html = html.replace(/<!--MATH_INLINE_(\d+)-->/g, (match, index) => {
      try {
        return katex.renderToString(mathInlines[parseInt(index)], {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `<code>${mathInlines[parseInt(index)]}</code>`;
      }
    });

    html = html.replace(/<!--MERMAID_(\d+)-->/g, (match, index) => {
      try {
        return `<pre class="mermaid"> ${mermaidBlocks[parseInt(index)]} </pre>`;
      }
      catch {
        return `<div></div>`;
      }
    })
    
    html = html.replace(/<!--VIDEO_(\d+)-->/g, (match, index) => {
      try {
        return `<div class="video-container"><iframe src="${videoBlocks[parseInt(index)]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      catch {
        return `<div></div>`;
      }
    })

    html = html.replace(/<!--HTML_(\d+)-->/g, (match, index) => {
      try {
        return `<html-block data-src="${encodeURIComponent(htmlBlocks[parseInt(index)])}"></html-block>`;
      }
      catch {
        return `<div></div>`;
      }
    })
    
    if (slug) {
      html = html.replace(
        /<img([^>]*)src="\.\/([^"]+)"([^>]*)>/g,
        (match, before, src, after) => {
          return `<img${before}src="/data/posts/${src}"${after}>`;
        }
      );
    }

    // 直接把 cursor-target 写入输出 HTML，避免重新渲染后 class 丢失
    const ensureCursorTarget = (tagHtml: string) => {
      if (/\bclass\s*=\s*"[^"]*\bcursor-target\b[^"]*"/i.test(tagHtml)) {
        return tagHtml;
      }

      if (/\bclass\s*=\s*"[^"]*"/i.test(tagHtml)) {
        return tagHtml.replace(/\bclass\s*=\s*"([^"]*)"/i, (m, cls) => {
          const next = `${cls} cursor-target`.trim();
          return `class="${next}"`;
        });
      }

      return tagHtml.replace(/^(<\w+)/, "$1 class=\"cursor-target\"");
    };

    html = html.replace(/<img\b[^>]*>/gi, (tag) => ensureCursorTarget(tag));
    html = html.replace(/<a\b[^>]*>/gi, (tag) => ensureCursorTarget(tag));
    html = html.replace(/<blockquote\b[^>]*>/gi, (tag) => ensureCursorTarget(tag));

    return html;
  }, [content, slug]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
        const imgSrc = (target as HTMLImageElement).src;
        openLightbox(imgSrc);
      }
    };

    container.addEventListener("click", handleImageClick);

    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      img.style.cursor = "zoom-in";
    });

    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const usedIds = new Set<string>();

    headings.forEach((heading, index) => {
      const baseId = heading.textContent
        ?.trim()
        .toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `heading-${index}`;

      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }

      heading.id = id;
      usedIds.add(id);
    });

    return () => {
      container.removeEventListener("click", handleImageClick);
    };
  }, [mounted, renderedContent, openLightbox]);

  const parseHtmlToReact = (html: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    // Process both code blocks and html blocks in order
    const combinedRegex = /<code-block data-language="([^"]*)" data-code="([^"]*)"><\/code-block>|<html-block data-src="([^"]*)"><\/html-block>/g;

    while ((match = combinedRegex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        const beforeContent = html.slice(lastIndex, match.index);
        parts.push(
          <span
            key={key++}
            dangerouslySetInnerHTML={{ __html: beforeContent }}
          />
        );
      }

      if (match[1] !== undefined) {
        // code block
        const language = match[1];
        const code = decodeURIComponent(match[2]);
        parts.push(<CodeBlock key={key++} language={language}>{code}</CodeBlock>);
      } else if (match[3] !== undefined) {
        // html block
        const src = decodeURIComponent(match[3]);
        parts.push(<HtmlBlock key={key++} src={src} />);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < html.length) {
      const remainingContent = html.slice(lastIndex);
      parts.push(
        <span
          key={key++}
          dangerouslySetInnerHTML={{ __html: remainingContent }}
        />
      );
    }

    return parts.length > 0 ? parts : null;
  };

  useEffect(() => {
    if (!mounted) return;
    mermaid.run();
  }, [mounted, renderedContent]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: markdownStyles }} />
      <div
        ref={containerRef}
        className={`markdown-content prose prose-lg dark:prose-invert max-w-none ${className}`}
      >
        {parseHtmlToReact(renderedContent)}
      </div>

      {/* ============ 图片灯箱 - Portal 到 body 确保覆盖整个页面 ============ */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {lightboxImage && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeLightbox}
                style={{ cursor: "zoom-out" }}
              />

              {/* 图片容器 */}
              <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="pointer-events-auto relative max-w-[90vw] max-h-[90vh]"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                >
                  {/* 关闭按钮 */}
                  <motion.button
                    className="cursor-target absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm hover:bg-[#00d4ff] hover:text-[#0a0e27] hover:border-[#00d4ff] transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeLightbox();
                    }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    aria-label="关闭图片"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lightboxImage}
                    alt="Full size"
                    className="block max-w-[90vw] max-h-[85vh] rounded-lg object-contain select-none"
                    style={{
                      boxShadow: "0 0 60px rgba(0, 212, 255, 0.25), 0 25px 50px rgba(0, 0, 0, 0.3)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
