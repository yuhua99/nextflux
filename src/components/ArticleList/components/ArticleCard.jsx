import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { cleanTitle, cn, extractFirstImage } from "@/lib/utils";
import { formatPublishDate } from "@/lib/format";
import ArticleCardCover from "./ArticleCardCover.jsx";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { useMemo, useRef, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { settingsState } from "@/stores/settingsStore";

export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const cardRef = useRef(null);
  const { markAsReadOnScroll } = useStore(settingsState);
  const hasBeenVisible = useRef(false);

  const imageUrl = useMemo(() => extractFirstImage(article), [article]);

  useEffect(() => {
    // 如果文章已读或未启用滚动标记已读,则不需要观察
    if (article.status === "read" || !markAsReadOnScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当文章进入视口
          if (entry.isIntersecting) {
            hasBeenVisible.current = true;
          } 
          // 当文章完全离开视口且之前已经显示过
          else if (hasBeenVisible.current && entry.intersectionRatio === 0) {
            handleMarkStatus(article);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // 设置阈值为0,表示完全离开视口时触发
        threshold: 0,
        // 设置根元素为滚动容器
        root: document.querySelector("[data-radix-scroll-area-viewport]"),
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [article, markAsReadOnScroll]);

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
    <div
      ref={cardRef}
      className={cn(
        "cursor-pointer select-none overflow-hidden p-2 rounded-lg",
        "relative transform-gpu transition-colors duration-200",
        "bg-transparent contain-content",
        "hover:bg-background",
        parseInt(articleId) === article.id && "bg-background shadow-small",
      )}
      data-article-id={article.id}
      onClick={() => handleArticleClick(article)}
    >
      <div
        className={cn(
          "card-content flex flex-col gap-1",
          article.status === "read" && "opacity-50",
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
              "card-title text-base font-bold line-clamp-2 text-wrap break-words",
              article.status === "read"
                ? "text-content2-foreground"
                : "text-foreground",
            )}
          >
            {cleanTitle(article.title)}
          </h3>
        </div>

        <ArticleCardCover imageUrl={imageUrl} />
      </div>
    </div>
  );
}
