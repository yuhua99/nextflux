import { memo } from "react";
import ArticleCard from "./ArticleCard";
import { Divider } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { filter } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Virtuoso } from "react-virtuoso";

const ArticleItem = memo(({ article, isLast }) => (
  <div className="mx-2">
    <ArticleCard article={article} />
    {!isLast && (
      <div className="mx-1 my-2">
        <Divider />
      </div>
    )}
  </div>
));
ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  let info = [feedId, categoryId, $filter].filter(Boolean).join("-");

  return (
    <Virtuoso
      className="article-list-content flex-1 h-full"
      data={articles}
      components={{
        Header: () => <div className="vlist-header h-16"></div>,
        Footer: () => <div className="vlist-footer h-16"></div>,
      }}
      itemContent={(index, article) => (
        <ArticleItem
          key={article.id}
          article={article}
          isLast={index === articles.length - 1}
          info={info}
        />
      )}
    />
  );
}
