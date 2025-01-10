import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "@/stores/syncStore.js";
import {
  filter,
  filteredArticles,
  loadArticles,
} from "@/stores/articlesStore.js";
import { Outlet, useLocation, useParams } from "react-router-dom";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";
import EmptyPlaceholder from "./components/EmptyPlaceholder";
import { settingsState } from "@/stores/settingsStore.js";

const ArticleList = () => {
  const { feedId, categoryId } = useParams();
  const $filteredArticles = useStore(filteredArticles);
  const $lastSync = useStore(lastSync);
  const $filter = useStore(filter);
  const { sortDirection, showHiddenFeeds } = useStore(settingsState);
  const location = useLocation();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const loadAndFilterArticles = () => {
      if (feedId) {
        loadArticles(feedId, "feed");
      } else if (categoryId) {
        loadArticles(categoryId, "category");
      } else {
        loadArticles();
      }
    };

    loadAndFilterArticles();
  }, [feedId, categoryId, $lastSync, $filter, sortDirection, showHiddenFeeds]);

  // 监听 feedId、categoryId 和 filter 变化，滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(".v-list");
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = 0;
        }, 300);
      }
    }
  }, [feedId, categoryId, $filter]);

  return (
    <div className="main-content flex bg-content2">
      <div
        ref={scrollAreaRef}
        className="w-full relative max-w-[100vw] md:w-[21rem] md:max-w-[30%] md:min-w-[18rem] h-[100dvh] bg-content2 flex flex-col md:border-r"
      >
        <ArticleListHeader />
        <ArticleListContent articles={$filteredArticles} />
        <ArticleListFooter />
      </div>
      {!location.pathname.includes("/article/") ? (
        <EmptyPlaceholder />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default ArticleList;
