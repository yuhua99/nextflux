import { atom } from "nanostores";
import storage from "@/db/storage";

// 搜索弹窗开关状态
export const searchModalOpen = atom(false);

// 搜索结果
export const searchResults = atom([]);

// 搜索加载状态
export const searching = atom(false);

// 执行搜索
export async function search(keyword) {
  if (!keyword) {
    searchResults.set([]);
    return;
  }

  searching.set(true);
  try {
    const articles = await storage.searchArticles(keyword);
    searchResults.set(articles);
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    searching.set(false);
  }
}
