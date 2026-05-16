import { getNotices } from "@/lib/static-data";
import NoticesClient from "@/components/notices/NoticesClient";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

/** 在构建时读取所有通知的 markdown 内容 */
function getAllNoticeContents(): Record<string, string> {
  const contents: Record<string, string> = {};
  const notices = getNotices();
  for (const notice of notices) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "notices",
      `${notice.slug}.md`
    );
    try {
      contents[notice.slug] = fs.readFileSync(filePath, "utf-8");
    } catch {
      contents[notice.slug] = "";
    }
  }
  return contents;
}

export default function NoticesPage() {
  const notices = getNotices();
  const contents = getAllNoticeContents();

  return <NoticesClient notices={notices} contents={contents} />;
}
