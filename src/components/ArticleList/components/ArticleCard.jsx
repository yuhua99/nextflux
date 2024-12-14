import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { cleanTitle, cn, extractFirstImage } from "@/lib/utils";
import { formatPublishDate } from "@/lib/format";
import ArticleCardCover from "./ArticleCardCover.jsx";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { useMemo } from "react";
import { Button } from "@nextui-org/react";

export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const imageUrl = useMemo(() => extractFirstImage(article), [article]);

  const handleArticleClick = async (article) => {
    const basePath = window.location.pathname.split("/article/")[0];
    const toUrl =
      basePath === "/"
        ? `/article/${article.id}`
        : `${basePath}/article/${article.id}`;
    navigate(toUrl);
    if (article.status !== "read") {
      await handleMarkStatus(article);
    }
  };

  return (
    <Button
      data-article-id={article.id}
      onPress={() => handleArticleClick(article)}
      color="default"
      className={cn(
        "w-full h-auto p-2",
        parseInt(articleId) === article.id && "bg-background shadow-small"
      )}
      radius="sm"
      variant="light"
    >
      <div
        className={cn(
          "card-content flex flex-col gap-1 w-full",
          article.status === "read" && "opacity-50"
        )}
      >
        <div className="card-header">
          <div className="card-meta flex items-start justify-between gap-1 mb-1">
            <div className="card-source flex items-center flex-1 gap-1 min-w-0">
              <div className="card-source-content flex flex-col min-w-0">
                <span className="card-source-title text-content2-foreground font-bold text-xs line-clamp-1">
                  {article.feed?.title}
                </span>
              </div>
            </div>
            <div className="card-time-wrapper flex items-center gap-1 text-xs text-content3-foreground">
              <span className="card-star">
                <Star
                  className="size-3 fill-content2-foreground"
                  style={{ opacity: article.starred ? 1 : 0 }}
                />
              </span>
              <span className="card-time whitespace-nowrap">
                {formatPublishDate(article.published_at)}
              </span>
            </div>
          </div>

          <h3
            className={cn(
              "card-title text-base font-bold line-clamp-2 text-wrap break-words text-left",
              article.status === "read"
                ? "text-content2-foreground"
                : "text-foreground"
            )}
          >
            {cleanTitle(article.title)}
          </h3>
        </div>

        <ArticleCardCover imageUrl={imageUrl} />
      </div>
    </Button>
  );
}
