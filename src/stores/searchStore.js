import { atom } from "nanostores";
import storage from "@/db/storage";
import { feeds } from "@/stores/feedsStore";
import { settingsState } from "@/stores/settingsStore";

// 搜索弹窗开关状态
export const searchModalOpen = atom(false);

// 搜索结果
export const searchResults = atom([]);
export const feedSearchResults = atom([]);

// 搜索加载状态
export const searching = atom(false);

// 全部文章缓存
export const articlesCache = atom([]);

export async function loadArticlesCache() {
  const articles = await storage.getArticles();
  // 按照发布时间排序
  articlesCache.set(articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)));
}

// 执行文章搜索
export async function search(keyword) {
  if (!keyword) {
    searchResults.set([]);
    return;
  }

  searching.set(true);
  try {
    const showHiddenFeeds = settingsState.get().showHiddenFeeds;
    const visibleFeedIds = feeds
      .get()
      .filter((feed) => showHiddenFeeds || !feed.hide_globally)
      .map((feed) => feed.id);

    const results = articlesCache.get().filter((article) => {
      // 首先检查文章所属的feed是否可见
      if (!visibleFeedIds.includes(article.feedId)) {
        return false;
      }

      const searchText = [article.title, article.content, article.author]
        .join(" ")
        .toLowerCase();

      return searchText.includes(keyword.toLowerCase());
    });

    searchResults.set(results);
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    searching.set(false);
  }
}

// 执行订阅源搜索
export async function searchFeeds(keyword) {
  if (!keyword) {
    feedSearchResults.set([]);
    return;
  }

  searching.set(true);
  try {
    const showHiddenFeeds = settingsState.get().showHiddenFeeds;
    const results = feeds.get().filter((feed) => {
      // 先检查feed是否应该显示
      if (!showHiddenFeeds && feed.hide_globally) {
        return false;
      }

      const searchText = [feed.title, feed.url, feed.categoryName]
        .join(" ")
        .toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    feedSearchResults.set(results);
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    searching.set(false);
  }
}
