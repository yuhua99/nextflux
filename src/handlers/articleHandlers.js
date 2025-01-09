import {
  updateArticleStarred,
  updateArticleStatus,
  markAllAsRead,
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

// 处理标记所有文章为已读
export const handleMarkAllRead = async (type, id) => {
  try {
    switch (type) {
      case "feed":
        await markAllAsRead("feed", id);
        break;
      case "category":
        await markAllAsRead("category", id);
        break;
      default:
        await markAllAsRead();
    }
  } catch (err) {
    console.error("标记已读失败:", err);
  }
};
