import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "./ArticleView.css";
import ActionButtons from "@/components/ArticleView/components/ActionButtons.jsx";
import { generateReadableDate } from "@/lib/format.js";
import { activeArticle, filteredArticles } from "@/stores/articlesStore.js";
import { Chip, Divider, ScrollShadow } from "@nextui-org/react";
import EmptyPlaceholder from "@/components/ArticleList/components/EmptyPlaceholder";
import { cleanTitle, cn, getFontSizeClass } from "@/lib/utils";
import ArticleImage from "@/components/ArticleView/components/ArticleImage.jsx";
import parse from "html-react-parser";
import { settingsState } from "@/stores/settingsStore";
import { AnimatePresence, motion } from "framer-motion";
import VideoPlayer from "@/components/ArticleView/components/VideoPlayer.jsx";
import PlayAndPause from "@/components/ArticleView/components/PlayAndPause.jsx";
import { themeState } from "@/stores/themeStore.js";
import CodeBlock from "@/components/ArticleView/components/CodeBlock.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const $filteredArticles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  const {
    lineHeight,
    fontSize,
    maxWidth,
    alignJustify,
    fontFamily,
    titleFontSize,
    titleAlignType,
  } = useStore(settingsState);
  const { themeMode, lightTheme, darkTheme } = useStore(themeState);
  const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  // 判断当前是否实际使用了stone主题
  const isStoneTheme = () => {
    if (themeMode === "system") {
      return (
        (systemMode === "light" && lightTheme === "stone") ||
        (systemMode === "dark" && darkTheme === "stone-dark")
      );
    }
    if (themeMode === "light") {
      return lightTheme === "stone";
    }
    if (themeMode === "dark") {
      return darkTheme === "stone-dark";
    }
  };
  const scrollAreaRef = useRef(null);

  // 监听文章ID变化,滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current;
      if (viewport) {
        viewport.scrollTo({
          top: 0,
          behavior: "instant", // 使用 instant 避免与动画冲突
        });
      }
    }
  }, [articleId]);

  useEffect(() => {
    const loadArticleByArticleId = async () => {
      if (articleId && $filteredArticles.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const loadedArticle = $filteredArticles.find(
            (article) => article.id === parseInt(articleId),
          );
          if (loadedArticle) {
            // 保存原始内容
            loadedArticle.originalContent = loadedArticle.content;
            activeArticle.set(loadedArticle);
          } else {
            setError("请选择要阅读的文章");
          }
        } catch (err) {
          console.error("加载文章失败:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadArticleByArticleId();
  }, [$filteredArticles, articleId]);

  const handleLinkWithImg = (domNode) => {
    const imgNode = domNode.children.find(
      (child) => child.type === "tag" && child.name === "img",
    );

    if (imgNode) {
      const hostname =
        new URL(domNode.attribs.href).hostname || domNode.attribs.href;
      return (
        <>
          <ArticleImage imgNode={imgNode} />
          <div className="flex justify-center">
            <Chip
              color="primary"
              variant="flat"
              size="sm"
              classNames={{ base: "cursor-pointer my-2" }}
              onClick={() => {
                window.open(domNode.attribs.href, "_blank");
              }}
            >
              {hostname}...
            </Chip>
          </div>
        </>
      );
    }
    return domNode;
  };

  // 检查是否有音频附件
  const audioEnclosure = $activeArticle?.enclosures?.find((enclosure) =>
    enclosure.mime_type?.startsWith("audio/"),
  );

  if (loading || !$activeArticle || error) {
    return <EmptyPlaceholder />;
  }

  return (
    <div
      className={cn(
        "flex-1 bg-content2 p-0 md:p-2 h-screen fixed md:static inset-0 z-50",
        "animate-in slide-in-from-right motion-reduce:animate-none",
      )}
    >
      <ScrollShadow
        ref={scrollAreaRef}
        isEnabled={false}
        className="article-scroll-area h-full bg-background rounded-none md:rounded-lg shadow-none md:shadow-custom"
      >
        <ActionButtons parentRef={scrollAreaRef} />
        <div
          className="article-view-content px-5 pt-5 pb-20 w-full mx-auto"
          style={{
            maxWidth: `${maxWidth}ch`,
            fontFamily: fontFamily,
          }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={$activeArticle?.id}
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
              exit={{ y: -20, opacity: 0 }}
            >
              <header
                className="article-header"
                style={{ textAlign: titleAlignType }}
              >
                <div className="text-default-500 text-sm">
                  {$activeArticle?.feed?.title}
                </div>
                <h1
                  className="font-semibold my-2 hover:cursor-pointer leading-tight"
                  style={{
                    fontSize: `${titleFontSize * fontSize}px`,
                  }}
                  onClick={() => window.open($activeArticle?.url, "_blank")}
                >
                  {cleanTitle($activeArticle?.title)}
                </h1>
                <div className="text-default-400 text-sm">
                  <time dateTime={$activeArticle?.published_at}>
                    {generateReadableDate($activeArticle?.published_at)}
                  </time>
                </div>
              </header>
              <Divider className="my-4" />
              {audioEnclosure && <PlayAndPause source={audioEnclosure} />}
              <PhotoProvider
                bannerVisible={false}
                loop={false}
                speed={() => 300}
                easing={(type) =>
                  type !== 2
                    ? "cubic-bezier(0.34, 1.3, 0.64, 1)"
                    : "cubic-bezier(0.25, 0.8, 0.25, 1)"
                }
              >
                <motion.div
                  className={cn(
                    "article-content prose dark:prose-invert max-w-none",
                    getFontSizeClass(fontSize),
                    isStoneTheme() ? "prose-stone" : "",
                  )}
                  style={{
                    lineHeight: lineHeight + "em",
                    textAlign: alignJustify ? "justify" : "left",
                  }}
                  key={$activeArticle?.id}
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
                  exit={{ y: -20, opacity: 0 }}
                >
                  {parse($activeArticle?.content, {
                    replace(domNode) {
                      if (domNode.type === "tag" && domNode.name === "img") {
                        return <ArticleImage imgNode={domNode} />;
                      }
                      if (domNode.type === "tag" && domNode.name === "a") {
                        return domNode.children.length > 0
                          ? handleLinkWithImg(domNode)
                          : domNode;
                      }
                      if (domNode.type === "tag" && domNode.name === "video") {
                        // 获取视频的 src 属性
                        const videoSrc =
                          domNode.attribs?.src ||
                          domNode.children?.find(
                            (child) =>
                              child.type === "tag" && child.name === "source",
                          )?.attribs?.src;

                        if (videoSrc) {
                          return (
                            <VideoPlayer src={videoSrc} provider="video" />
                          );
                        }
                        return domNode;
                      }
                      if (domNode.type === "tag" && domNode.name === "iframe") {
                        const { src } = domNode.attribs;

                        // 判断是否为 YouTube iframe
                        const isYouTube =
                          src &&
                          (src.includes("youtube.com/embed") ||
                            src.includes("youtu.be") ||
                            src.includes("youtube-nocookie.com/embed"));

                        // 判断是否为 Bilibili iframe
                        const isBilibili = src && src.includes("bilibili");

                        // 如果不是 YouTube iframe,直接返回原始节点
                        if (!isYouTube && !isBilibili) {
                          return domNode;
                        }

                        // 如果是 Bilibili iframe, 组装新的iframe，不使用VideoPlayer组件
                        if (isBilibili) {
                          // 获取bilibili视频 bvid
                          const bvid = src.match(/bvid=([^&]+)/)?.[1];
                          if (bvid) {
                            return (
                              <iframe
                                src={`//bilibili.com/blackboard/html5mobileplayer.html?isOutside=true&bvid=${bvid}&p=1&hideCoverInfo=1&danmaku=0`}
                                allowFullScreen={true}
                              ></iframe>
                            );
                          }
                          return domNode;
                        }

                        // YouTube iframe 显示打开链接的按钮
                        return <VideoPlayer src={src} provider="youtube" />;
                      }
                      if (domNode.type === "tag" && domNode.name === "pre") {
                        const codeNode = domNode.children.find(
                          (child) =>
                            child.type === "tag" && child.name === "code",
                        );

                        if (codeNode) {
                          const className = codeNode.attribs.class || "";
                          const language =
                            className
                              .split(/\s+/)
                              .find(
                                (cls) =>
                                  cls.startsWith("language-") ||
                                  cls.startsWith("lang-"),
                              )
                              ?.replace(/^(language-|lang-)/, "") || "text";

                          const code = codeNode.children[0].data;

                          return <CodeBlock code={code} language={language} />;
                        }
                      }
                    },
                  })}
                </motion.div>
              </PhotoProvider>
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollShadow>
    </div>
  );
};

export default ArticleView;
