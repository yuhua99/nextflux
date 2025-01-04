import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { filteredArticles, activeArticle } from "@/stores/articlesStore";
import { handleMarkStatus, handleToggleStar } from "@/handlers/articleHandlers";
import { forceSync } from "@/stores/syncStore";

export function useHotkeys({ parentRef = null } = {}) {
  const navigate = useNavigate();
  const $articles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);

  // 获取当前文章在列表中的索引
  const currentIndex = $articles.findIndex((a) => a.id === $activeArticle?.id);

  // 获取当前路径并去掉 article 部分
  const basePath = window.location.pathname.split("/article/")[0];

  useEffect(() => {
    const handleKeyDown = async (e) => {
      // 如果焦点在输入框中,不触发快捷键
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "j": // 下一篇
          if (currentIndex < $articles.length - 1) {
            const nextArticle = $articles[currentIndex + 1];
            navigate(`${basePath}/article/${nextArticle.id}`);
            if (nextArticle.status !== "read") {
              await handleMarkStatus(nextArticle);
            }
          }
          break;

        case "k": // 上一篇
          if (currentIndex > 0) {
            const prevArticle = $articles[currentIndex - 1];
            navigate(`${basePath}/article/${prevArticle.id}`);
            if (prevArticle.status !== "read") {
              await handleMarkStatus(prevArticle);
            }
          }
          break;

        case "m": // 标记已读/未读
          if ($activeArticle) {
            await handleMarkStatus($activeArticle);
          }
          break;

        case "s": // 收藏/取消收藏
          if ($activeArticle) {
            await handleToggleStar($activeArticle);
          }
          break;

        case "r": // 刷新
          if (!e.ctrlKey && !e.metaKey) {
            await forceSync();
          }
          break;

        case "escape": // 关闭文章
          navigate(basePath || "/");
          break;

        case "v": // 在新标签页打开原文
          if ($activeArticle) {
            window.open($activeArticle.url, "_blank");
          }
          break;

        default:
          break;
      }
    };

    const target = parentRef?.current || window;
    target.addEventListener("keydown", handleKeyDown);

    return () => {
      target.removeEventListener("keydown", handleKeyDown);
    };
  }, [$activeArticle, currentIndex, $articles, basePath, navigate, parentRef]);
} 