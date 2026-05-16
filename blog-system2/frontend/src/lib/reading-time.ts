export interface MarkdownReadingStats {
  wordCount: number;
  readingTime: number;
  imageCount: number;
  codeBlockCount: number;
  tableCount: number;
}

function stripMarkdown(markdown: string): string {
  return markdown
    // Remove fenced code blocks entirely from pure text counting
    .replace(/```[\s\S]*?```/g, " ")
    // Remove inline code markers
    .replace(/`[^`]*`/g, " ")
    // Remove image syntax while keeping alt text out of word count
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // Convert markdown links to visible text only
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Remove HTML tags
    .replace(/<[^>]+>/g, " ")
    // Remove common markdown symbols
    .replace(/[#>*_~\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  const matches = text.match(/[\u4e00-\u9fff]|[a-zA-Z0-9]+/g);
  return matches ? matches.length : 0;
}

function countImages(markdown: string): number {
  const markdownImages = markdown.match(/!\[[^\]]*\]\([^)]*\)/g) || [];
  const htmlImages = markdown.match(/<img\b[^>]*>/gi) || [];
  return markdownImages.length + htmlImages.length;
}

function countCodeBlocks(markdown: string): number {
  const fenced = markdown.match(/```[\s\S]*?```/g) || [];
  return fenced.length;
}

function countTables(markdown: string): number {
  const tableSeparators = markdown.match(
    /(^|\n)\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*(\n|$)/g
  );
  return tableSeparators ? tableSeparators.length : 0;
}

/**
 * 基于 markdown 内容估算阅读统计。
 * 规则：基础字数时间 + 图片/代码块/表格复杂度耗时。
 */
export function calculateMarkdownReadingStats(
  markdown: string,
  wordsPerMinute: number = 260
): MarkdownReadingStats {
  const safeMarkdown = markdown || "";
  const text = stripMarkdown(safeMarkdown);

  const wordCount = countWords(text);
  const imageCount = countImages(safeMarkdown);
  const codeBlockCount = countCodeBlocks(safeMarkdown);
  const tableCount = countTables(safeMarkdown);

  const baseMinutes = wordCount / wordsPerMinute;
  const imageMinutes = imageCount * 0.35;
  const codeMinutes = codeBlockCount * 0.8;
  const tableMinutes = tableCount * 0.5;

  const readingTime = Math.max(
    1,
    Math.ceil(baseMinutes + imageMinutes + codeMinutes + tableMinutes)
  );

  return {
    wordCount,
    readingTime,
    imageCount,
    codeBlockCount,
    tableCount,
  };
}
