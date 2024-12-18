import { memo } from "react";
import ArticleCard from "./ArticleCard";
import { useParams } from "react-router-dom";
import { filter } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Virtuoso } from "react-virtuoso";
import { AnimatePresence, motion } from "framer-motion";

const ArticleItem = memo(({ article, isLast }) => (
  <div className="mx-2">
    <ArticleCard article={article} />
    {!isLast && (
      <div className="h-4">
    )}
  </div>
));
ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  let info = [feedId, categoryId, $filter].filter(Boolean).join("-");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={info}
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0.3,
            opacity: { delay: 0.05 },
          },
        }}
        exit={{ y: -50, opacity: 0 }}
        className="article-list-content flex-1"
      >
        <Virtuoso
          className="v-list h-full"
          data={articles}
          components={{
            Header: () => <div className="vlist-header h-2"></div>,
            Footer: () => <div className="vlist-footer h-16"></div>,
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
  );
}
