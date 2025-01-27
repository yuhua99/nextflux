import { memo, useEffect, useRef } from "react";
import ArticleCard from "./ArticleCard";
import { useParams } from "react-router-dom";
import { filter, unreadArticlesCount } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Virtuoso } from "react-virtuoso";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { Button } from "@heroui/react";
import { CheckCheck, Loader2 } from "lucide-react";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { isSyncing } from "@/stores/syncStore.js";
import { useTranslation } from "react-i18next";
import { settingsState } from "@/stores/settingsStore.js";

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
  const $unreadArticlesCount = useStore(unreadArticlesCount);
  const $isSyncing = useStore(isSyncing);
  const { isMedium } = useIsMobile();
  let info = [feedId, categoryId, $filter].filter(Boolean).join("-");
  const listRef = useRef(null);
  const { reduceMotion } = useStore(settingsState);
  const index = articles.findIndex(
    (article) => article.id === parseInt(articleId),
  );
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

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <AnimatePresence mode="wait" initial={false}>
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
            data={articles}
            context={{
              feedId,
              categoryId,
              $filter,
              $unreadArticlesCount,
              $isSyncing,
              handleMarkAllRead,
            }}
            totalCount={articles.length}
            components={{
              Header: () => <div className="vlist-header h-2"></div>,
              Footer: ({
                context: {
                  feedId,
                  categoryId,
                  $filter,
                  $unreadArticlesCount,
                  $isSyncing,
                  handleMarkAllRead,
                },
              }) => (
                <div className="vlist-footer h-24 pt-2 px-2">
                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={
                      $filter === "starred" || $unreadArticlesCount === 0
                    }
                    fullWidth
                    startContent={
                      $isSyncing ? (
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
      </AnimatePresence>
    </MotionConfig>
  );
}
