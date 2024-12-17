import { memo, useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Button, Divider } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { filter } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";

const ArticleItem = memo(({ article, isLast, info }) => (
  <motion.li
    key={info + article.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <ArticleCard article={article} />
    {!isLast && (
      <div className="mx-1 my-2">
        <Divider />
      </div>
    )}
  </motion.li>
));
ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [displayArticles, setDisplayArticles] = useState(
    articles.slice(0, pageSize),
  );
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  let info = [feedId, categoryId, $filter].filter(Boolean).join("-");

  useEffect(() => {
    setDisplayArticles(articles.slice(0, currentPage * pageSize));
  }, [articles, currentPage, pageSize]);

  // 监听 info 变化，重置 currentPage
  useEffect(() => {
    setCurrentPage(1);
  }, [info]);

  return (
    <AnimatePresence mode="wait">
      <div className="article-list-content flex-1 px-2 py-16" key={info}>
        {displayArticles.length !== 0 && (
          <>
            <ul className="articles">
              {displayArticles.map((article, index) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  isLast={index === displayArticles.length - 1}
                  info={info}
                />
              ))}
            </ul>
            {displayArticles.length < articles.length && (
              <div className="w-full px-2 pt-1">
                <Button
                  variant="flat"
                  className="w-full text-content2-foreground"
                  onPress={() => setCurrentPage(currentPage + 1)}
                >
                  加载更多
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatePresence>
  );
}
