import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  filter,
  filteredArticles,
} from "@/stores/articlesStore.js";
import { useParams } from "react-router-dom";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";
import { settingsState } from "@/stores/settingsStore.js";
import ArticleView from "@/components/ArticleView/ArticleView.jsx";

const ArticleList = () => {
  const { feedId, categoryId } = useParams();
  const $filteredArticles = useStore(filteredArticles);
  const { showUnreadByDefault } =
    useStore(settingsState);



  // 组件挂载时设置默认过滤器
  useEffect(() => {
    if (!feedId && !categoryId && showUnreadByDefault) {
      filter.set("unread");
    }
  }, []);

  return (
    <div className="main-content flex bg-content2">
      <div
        className="w-full relative max-w-[100vw] md:w-[21rem] md:max-w-[30%] md:min-w-[18rem] h-[100dvh] bg-content2 flex flex-col"
      >
        <ArticleListHeader />
        <ArticleListContent articles={$filteredArticles} />
        <ArticleListFooter />
      </div>
      <ArticleView />
    </div>
  );
};

export default ArticleList;
