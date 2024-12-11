import {
  updateArticleStarred,
  updateArticleStatus,
} from "../stores/articlesStore.js";

// 处理文章状态更新
export const handleMarkStatus = async (article) => {
  try {
    await updateArticleStatus(article);
  } catch (err) {
    console.error("更新文章状态失败:", err);
  }
};

// 处理文章星标状态更新
export const handleToggleStar = async (article) => {
  try {
    await updateArticleStarred(article);
  } catch (err) {
    console.error("更新文章星标状态失败:", err);
  }
};
