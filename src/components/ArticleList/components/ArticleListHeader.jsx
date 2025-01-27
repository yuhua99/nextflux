import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import {
  filter,
  filteredArticles,
  unreadArticlesCount,
} from "@/stores/articlesStore.js";
import { feeds } from "@/stores/feedsStore.js";
import MarkAllReadButton from "./MarkAllReadButton";
import { isSyncing } from "@/stores/syncStore.js";
import MenuButton from "./MenuButton";
import { useTranslation } from "react-i18next";

export default function ArticleListHeader() {
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  const $feeds = useStore(feeds);
  const $isSyncing = useStore(isSyncing);
  const $articles = useStore(filteredArticles);
  const $unreadArticlesCount = useStore(unreadArticlesCount);
  const { t } = useTranslation();
  // 获取标题文本
  const getTitleText = () => {
    if (feedId) {
      const feed = $feeds.find((f) => f.id === parseInt(feedId));
      return feed?.title || "";
    }

    if (categoryId) {
      const feed = $feeds.find((f) => f.categoryId === parseInt(categoryId));
      return feed?.categoryName || "";
    }

    switch ($filter) {
      case "unread":
        return t("articleList.unread");
      case "starred":
        return t("articleList.starred");
      default:
        return t("articleList.all");
    }
  };

  // 获取当前筛选结果的计数
  const getFilteredCount = () => {
    switch ($filter) {
      case "starred": {
        const starredCount = $articles.filter(
          (article) => article.starred,
        ).length;
        return starredCount > 0
          ? `${starredCount} ${t("articleList.starredItems")}`
          : `${t("articleList.noStarred")}`;
      }
      case "unread":
      case "all": {
        return $unreadArticlesCount > 0
          ? `${$unreadArticlesCount} ${t("articleList.unreadItems")}`
          : `${t("articleList.noUnread")}`;
      }
      default:
        return "";
    }
  };

  return (
    <div className="px-2">
      <div className="article-list-header w-full z-10 bg-content2 border-b py-2 standalone:pt-safe-or-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{getTitleText()}</span>
            <span className="truncate text-xs text-default-400">
              {$isSyncing ? t("common.syncing") : getFilteredCount()}
            </span>
          </div>
          <div className="ml-auto">
            <MarkAllReadButton />
          </div>
          <MenuButton />
        </div>
      </div>
    </div>
  );
}
