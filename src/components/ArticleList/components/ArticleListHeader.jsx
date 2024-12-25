import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.jsx";
import { Divider } from "@nextui-org/react";
import { filter, filteredArticles } from "@/stores/articlesStore.js";
import { feeds } from "@/stores/feedsStore.js";
import MarkAllReadButton from "./MarkAllReadButton";
import { isSyncing } from "@/stores/syncStore.js";
import MenuButton from "./MenuButton";
import { cn } from "@/lib/utils.js";

export default function ArticleListHeader() {
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  const $feeds = useStore(feeds);
  const $isSyncing = useStore(isSyncing);
  const $articles = useStore(filteredArticles);
  const { isMobile } = useSidebar();

  // 获取标题文本
  const getTitleText = () => {
    if (feedId) {
      const feed = $feeds.find((f) => f.id === parseInt(feedId));
      return feed?.title || "未知订阅源";
    }

    if (categoryId) {
      const feed = $feeds.find((f) => f.categoryId === parseInt(categoryId));
      return feed?.categoryName || "未知分类";
    }

    switch ($filter) {
      case "unread":
        return "未读";
      case "starred":
        return "收藏";
      default:
        return "全部文章";
    }
  };

  // 获取当前筛选结果的计数
  const getFilteredCount = () => {
    switch ($filter) {
      case "starred": {
        const starredCount = $articles.filter(
          (article) => article.starred,
        ).length;
        return starredCount > 0 ? `${starredCount} 篇收藏` : "无收藏";
      }
      case "unread":
      case "all": {
        const unreadCount = $articles.filter(
          (article) => article.status !== "read",
        ).length;
        return unreadCount > 0 ? `${unreadCount} 篇未读` : "无未读";
      }
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "article-list-header absolute top-0 w-full px-3 z-10",
        isMobile ? "bg-content2/80 backdrop-blur-lg" : "bg-content2",
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="my-2.5" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{getTitleText()}</span>
          <span className="truncate text-xs text-default-400">
            {$isSyncing ? "同步中..." : getFilteredCount()}
          </span>
        </div>
        <div className="ml-auto">
          <MarkAllReadButton />
        </div>
        <MenuButton />
      </div>
      <Divider className="w-auto" />
    </div>
  );
}
