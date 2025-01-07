import { ScrollShadow } from "@nextui-org/react";
import { FolderSearch, Inbox } from "lucide-react";
import FeedIcon from "@/components/ui/FeedIcon.jsx";
import { formatDate } from "@/lib/format.js";

export default function SearchResults({ results, keyword, onSelect }) {
  // 如果没有关键词,显示搜索历史
  if (!keyword) {
    return (
      <div className="flex flex-col items-center gap-2 w-full justify-center h-full text-default-400">
        <Inbox className="size-16" />
        请输入关键词
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 w-full justify-center h-full text-default-400">
        <FolderSearch className="size-16" />
        无相关结果
      </div>
    );
  }

  return (
    <ScrollShadow>
      <div className="p-2">
        {results.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between gap-2 px-2 py-2 text-sm hover:bg-default rounded-lg cursor-pointer"
            onClick={() => onSelect(article)}
          >
            <div className="flex items-center gap-2">
              <FeedIcon url={article.url} />
              <div className="flex-1 line-clamp-1">{article.title}</div>
            </div>
            <div className="shrink-0 line-clamp-1 text-xs text-default-400">
              {formatDate(article.published_at)}
            </div>
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
}
