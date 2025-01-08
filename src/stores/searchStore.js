import { atom } from "nanostores";
import storage from "@/db/storage";

// 搜索弹窗开关状态
export const searchModalOpen = atom(false);

// 搜索结果
export const searchResults = atom([]);

// 搜索加载状态
export const searching = atom(false);

// 全部文章缓存
export const articlesCache = atom([]);

export async function loadArticlesCache() {
  const articles = await storage.getArticles();
  articlesCache.set(articles);
}

// 执行搜索
export async function search(keyword) {
  if (!keyword) {
    searchResults.set([]);
    return;
  }

  searching.set(true);
  try {
    const results = articlesCache.get().filter((article) => {
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
