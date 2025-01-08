import { ScrollShadow } from "@nextui-org/react";
import { FolderSearch, Inbox } from "lucide-react";
import FeedIcon from "@/components/ui/FeedIcon.jsx";
import { formatDate } from "@/lib/format.js";
import { useEffect, useRef, useState } from "react";

export default function SearchResults({ results, keyword, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef(null);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSelect(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex, onSelect]);

  // 确保选中项在视野内
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "instant",
        });
      }
    }
  }, [selectedIndex]);

  // 重置搜索时重置选中项
  useEffect(() => {
    setSelectedIndex(0);
  }, [keyword]);

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
      <div ref={listRef} className="p-2">
        {results.map((article, index) => (
          <div
            key={article.id}
            className={`flex items-center justify-between gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer ${
              index === selectedIndex ? "bg-default" : "hover:bg-default"
            }`}
            onClick={() => onSelect(article)}
            onMouseEnter={() => setSelectedIndex(index)}
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
