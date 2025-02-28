import { memo, useEffect, useRef, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useParams } from "react-router-dom";
import {
  filter,
  hasMore,
  currentPage,
  loadingMore,
  loading,
  filteredArticles,
} from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Virtuoso } from "react-virtuoso";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { Button, CircularProgress } from "@heroui/react";
import { CheckCheck, Loader2 } from "lucide-react";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { isSyncing, lastSync } from "@/stores/syncStore.js";
import { useTranslation } from "react-i18next";
import { settingsState } from "@/stores/settingsStore.js";
import { loadArticles } from "@/stores/articlesStore";

const ArticleItem = memo(({ article, isLast }) => (
  <div className="mx-2">
    <ArticleCard article={article} />
    {!isLast && <div className="h-4" />}
  </div>
));
ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const { t } = useTranslation();
  const { feedId, categoryId, articleId } = useParams();
  const $filter = useStore(filter);
  const $isSyncing = useStore(isSyncing);
  const { isMedium } = useIsMobile();
  let info = [feedId, categoryId, $filter].filter(Boolean).join("-");
  const listRef = useRef(null);
  const { reduceMotion } = useStore(settingsState);
  const index = articles.findIndex(
    (article) => article.id === parseInt(articleId),
  );
  const $hasMore = useStore(hasMore);
  const $currentPage = useStore(currentPage);
  const $loading = useStore(loading);
  const $loadingMore = useStore(loadingMore);
  const $lastSync = useStore(lastSync);

  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0,
  });

  useEffect(() => {
    const handleFetchArticles = async () => {
      filteredArticles.set([]);
      loading.set(true);
      try {
        const res = await loadArticles(
          feedId || categoryId,
          feedId ? "feed" : categoryId ? "category" : null,
        );
        filteredArticles.set(res.articles);
        hasMore.set(res.isMore);
        currentPage.set(1);
        loading.set(false);
      } catch {
        console.error("加载文章失败");
        loading.set(false);
      }
    };
    if (visibleRange.startIndex === 0) {
      handleFetchArticles();
    }
  }, [$lastSync]);

  useEffect(() => {
    if (isMedium) {
      return;
    }
    if (index >= 0) {
      listRef.current?.scrollIntoView({
        index: index,
        behavior: "smooth",
      });
    }
  }, [isMedium, index]);

  const handleEndReached = async () => {
    if (!$hasMore || $loadingMore) return;

    try {
      loadingMore.set(true);
      const nextPage = $currentPage + 1;
      if (feedId) {
        await loadArticles(feedId, "feed", nextPage, true);
      } else if (categoryId) {
        await loadArticles(categoryId, "category", nextPage, true);
      } else {
        await loadArticles(null, null, nextPage, true);
      }
    } finally {
      loadingMore.set(false);
    }
  };

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <AnimatePresence mode="wait" initial={false}>
        {$loading ? (
          <CircularProgress
            aria-label="Loading..."
            classNames={{ base: "mx-auto p-3", svg: "w-5 h-5" }}
          />
        ) : (
          <motion.div
            key={info}
            initial={reduceMotion ? { opacity: 0 } : { y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                bounce: 0.3,
                opacity: { delay: 0.05 },
              },
            }}
            exit={reduceMotion ? { opacity: 0 } : { y: -50, opacity: 0 }}
            className="article-list-content flex-1"
          >
            <Virtuoso
              ref={listRef}
              className="v-list h-full"
              rangeChanged={setVisibleRange}
              overscan={{ main: 5, reverse: 0 }}
              data={articles}
              context={{
                feedId,
                categoryId,
                $filter,
                $isSyncing,
                handleMarkAllRead,
              }}
              totalCount={articles.length}
              endReached={handleEndReached}
              components={{
                Header: () => <div className="vlist-header h-2"></div>,
                Footer: ({
                  context: {
                    feedId,
                    categoryId,
                    $filter,
                    $isSyncing,
                    handleMarkAllRead,
                  },
                }) => (
                  <div className="vlist-footer h-24 pt-2 px-2">
                    <Button
                      size="sm"
                      variant="flat"
                      isDisabled={$filter === "starred"}
                      fullWidth
                      startContent={
                        $isSyncing || $loadingMore ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <CheckCheck className="size-4" />
                        )
                      }
                      onPress={() => {
                        if (feedId) {
                          handleMarkAllRead("feed", feedId);
                        } else if (categoryId) {
                          handleMarkAllRead("category", categoryId);
                        } else {
                          handleMarkAllRead();
                        }
                      }}
                    >
                      {t("articleList.markAllRead")}
                    </Button>
                  </div>
                ),
              }}
              itemContent={(index, article) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  isLast={index === articles.length - 1}
                />
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
