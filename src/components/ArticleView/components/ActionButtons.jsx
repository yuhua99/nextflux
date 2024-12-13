import {
  ArrowLeft,
  Circle,
  CircleDot,
  Forward,
  Reply,
  Share,
  Star,
} from "lucide-react";
import {
  handleMarkStatus,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import { Button, Divider, Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { activeArticle, filteredArticles } from "@/stores/articlesStore";

export default function ActionButtons() {
  const navigate = useNavigate();
  const $articles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  // 获取当前文章在列表中的索引
  const currentIndex = $articles.findIndex((a) => a.id === $activeArticle?.id);

  // 获取当前路径并去掉 article 部分
  const basePath = window.location.pathname.split("/article/")[0];

  // 处理关闭按钮点击
  const handleClose = () => {
    navigate(basePath || "/");
  };

  // 处理上一篇按钮点击
  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const prevArticle = $articles[currentIndex - 1];
      navigate(`${basePath}/article/${prevArticle.id}`);
      if (prevArticle.status !== "read") {
        await handleMarkStatus(prevArticle);
      }
    }
  };

  // 处理下一篇按钮点击
  const handleNext = async () => {
    if (currentIndex < $articles.length - 1) {
      const nextArticle = $articles[currentIndex + 1];
      navigate(`${basePath}/article/${nextArticle.id}`);
      if (nextArticle.status !== "read") {
        await handleMarkStatus(nextArticle);
      }
    }
  };

  // 处理分享按钮点击
  const handleShare = async () => {
    if (!$activeArticle) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: $activeArticle.title,
          url: $activeArticle.url,
        });
      } else {
        // 如果不支持原生分享,则复制链接到剪贴板
        await navigator.clipboard.writeText($activeArticle.url);
      }
    } catch (error) {
      console.error("分享失败:", error);
    }
  };

  return (
    <div className="action-buttons border-b border-divider absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-lg w-full px-3 py-2.5 z-[100]">
      <div className="flex items-center space-between">
        <div className="flex items-center gap-3">
          <Tooltip content="关闭">
            <Button
              content="关闭"
              onPress={handleClose}
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </Tooltip>
          <Divider orientation="vertical" className="h-6" />
          <Tooltip content="上一篇">
            <Button
              onPress={handlePrevious}
              className="hidden sm:flex"
              isDisabled={currentIndex <= 0}
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
            >
              <Reply className="h-4 w-4" />
              <span className="sr-only">上一篇</span>
            </Button>
          </Tooltip>
          <Tooltip content="下一篇">
            <Button
              onPress={handleNext}
              className="hidden sm:flex"
              isDisabled={currentIndex >= $articles.length - 1}
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
            >
              <Forward className="h-4 w-4" />
              <span className="sr-only">下一篇</span>
            </Button>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Tooltip
            content={
              $activeArticle?.status === "read" ? "标记为未读" : "标记为已读"
            }
          >
            <Button
              onPress={() => handleMarkStatus($activeArticle)}
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
            >
              {$activeArticle?.status === "read" ? (
                <Circle className="size-4" />
              ) : (
                <CircleDot className="size-4" />
              )}
              <span className="sr-only">
                {$activeArticle?.status === "read"
                  ? "标记为未读"
                  : "标记为已读"}
              </span>
            </Button>
          </Tooltip>
          <Tooltip content={$activeArticle?.starred ? "取消收藏" : "收藏"}>
            <Button
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
              onPress={() => handleToggleStar($activeArticle)}
            >
              <Star
                className={`size-4 ${$activeArticle?.starred ? "fill-current" : ""}`}
              />
              <span className="sr-only">
                {$activeArticle?.starred ? "取消收藏" : "收藏"}
              </span>
            </Button>
          </Tooltip>
          <Tooltip content="分享">
            <Button
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
              onPress={handleShare}
            >
              <Share className="size-4" />
              <span className="sr-only">分享</span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
