import { atom } from "nanostores";
import minifluxAPI from "../api/miniflux";
import {
  getFeeds,
  addArticles,
  deleteArticlesByFeedId,
  getLastSyncTime,
  setLastSyncTime,
  addFeed,
  addCategory,
  deleteAllFeeds,
  deleteAllCategory,
} from "../db/storage";
import { extractTextFromHtml } from "@/lib/utils.js";
import { settingsState } from "./settingsStore";

// 在线状态
export const isOnline = atom(navigator.onLine);
// 同步状态
export const isSyncing = atom(false);
export const lastSync = atom(null);
// 错误信息
export const error = atom(null);

// 全局定时器变量
let syncInterval = null;

// 监听在线状态
if (typeof window !== "undefined") {
  window.addEventListener("online", () => isOnline.set(true));
  window.addEventListener("offline", () => isOnline.set(false));
}

// 从miniflux同步订阅源并保存到数据库
async function syncFeeds() {
  try {
    // 获取服务器上的所有订阅源和分类
    const [serverFeeds, serverCategories] = await Promise.all([
      minifluxAPI.getFeeds(),
      minifluxAPI.getCategories(),
    ]);

    // 获取本地数据库中的所有订阅源
    const localFeeds = await getFeeds();

    // 找出需要删除的订阅源（在本地存在但服务器上已不存在）
    const serverFeedIds = new Set(serverFeeds.map((feed) => feed.id));
    const feedsToDelete = localFeeds.filter(
      (feed) => !serverFeedIds.has(feed.id),
    );

    // 删除该订阅源的所有文章
    for (const feed of feedsToDelete) {
      await deleteArticlesByFeedId(feed.id);
    }

    // 清空本地订阅源和分类数据
    await Promise.all([deleteAllFeeds(), deleteAllCategory()]);

    // 同步分类数据
    for (const category of serverCategories) {
      await addCategory({
        id: category.id,
        title: category.title,
      });
    }

    // 重置现有订阅源
    for (const feed of serverFeeds) {
      await addFeed({
        id: feed.id,
        title: feed.title,
        url: feed.feed_url,
        site_url: feed.site_url,
        crawler: feed.crawler,
        hide_globally: feed.hide_globally,
        categoryId: feed.category.id,
        categoryName: feed.category.title,
        parsing_error_count: feed.parsing_error_count,
        keeplist_rules: feed.keeplist_rules,
        blocklist_rules: feed.blocklist_rules,
        rewrite_rules: feed.rewrite_rules,
      });
    }

    return serverFeeds;
  } catch (error) {
    console.error("同步订阅源失败:", error);
    throw error;
  }
}

// 从miniflux同步文章并保存到数据库
async function syncEntries() {
  try {
    const lastSyncTime = getLastSyncTime();
    const oneDayAgo = new Date(lastSyncTime);
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    if (!lastSyncTime) {
      // 首次同步时分页获取所有未读文章
      let offset = 0;
      const limit = 5000; // 每页5000条
      let unreadEntries = [];

      // 先获取总数
      const initialResponse = await minifluxAPI.getUnreadEntriesByPage(0, 1);
      const total = initialResponse.total;

      // 分页获取所有未读文章
      while (offset < total) {
        const response = await minifluxAPI.getUnreadEntriesByPage(
          offset,
          limit,
        );
        unreadEntries = [...unreadEntries, ...response.entries];
        offset += limit;

        // 更新同步进度
        const progress = Math.min(100, Math.round((offset / total) * 100));
        console.log(`同步进度: ${progress}%`);
      }

      // 获取所有星标文章
      const starredEntries = await minifluxAPI.getAllStarredEntries();

      // 合并去重
      const allEntries = [...unreadEntries];
      for (const entry of starredEntries) {
        if (!allEntries.find((e) => e.id === entry.id)) {
          allEntries.push(entry);
        }
      }

      // 批量保存到数据库
      if (allEntries.length > 0) {
        await addArticles(
          allEntries.map((entry) => ({
            id: entry.id,
            feedId: entry.feed.id,
            title: entry.title,
            author: entry.author,
            url: entry.url,
            content: entry.content,
            plainContent: extractTextFromHtml(entry.content),
            status: entry.status,
            starred: entry.starred ? 1 : 0,
            published_at: entry.published_at,
            created_at: entry.created_at,
            reading_time: entry.reading_time,
            enclosures: entry.enclosures || [],
          })),
        );
      }
    } else {
      // 增量同步 - 并行获取变更和新文章
      const [changedEntries, newEntries] = await Promise.all([
        minifluxAPI.getChangedEntries(oneDayAgo),
        minifluxAPI.getNewEntries(oneDayAgo),
      ]);

      // 合并去重
      const allEntries = [...changedEntries];
      for (const entry of newEntries) {
        if (!allEntries.find((e) => e.id === entry.id)) {
          allEntries.push(entry);
        }
      }

      // 批量保存到数据库
      if (allEntries.length > 0) {
        await addArticles(
          allEntries.map((entry) => ({
            id: entry.id,
            feedId: entry.feed.id,
            title: entry.title,
            author: entry.author,
            url: entry.url,
            content: entry.content,
            plainContent: extractTextFromHtml(entry.content),
            status: entry.status,
            starred: entry.starred ? 1 : 0,
            published_at: entry.published_at,
            created_at: entry.created_at,
            reading_time: entry.reading_time,
            enclosures: entry.enclosures || [],
          })),
        );
      }
    }
  } catch (error) {
    console.error("同步文章失败:", error);
    throw error;
  }
}

// 执行完整同步
export async function sync() {
  // 如果网络不在线或正在同步，则不执行同步
  if (!isOnline.get() || isSyncing.get()) return;

  // 设置同步状态为正在同步
  isSyncing.set(true);
  error.set(null);
  console.log("执行同步");

  try {
    // 同步订阅源并保存到数据库
    await syncFeeds();
    // 同步文章并保存到数据库
    await syncEntries();
    // 设置最后同步时间
    const now = new Date();
    setLastSyncTime(now);
    lastSync.set(now);
  } catch (err) {
    error.set(err);
  } finally {
    // 设置同步状态为未同步
    isSyncing.set(false);
  }
}

// 重置同步定时器
function resetSyncInterval() {
  if (syncInterval) {
    clearInterval(syncInterval);
    console.log("清除同步定时器");
    syncInterval = null;
  }

  const interval = parseInt(settingsState.get().syncInterval);

  // 如果设置为0或无效值，则不启动自动同步
  if (!interval) return;

  syncInterval = setInterval(performSync, interval * 60 * 1000);
  console.log("启动后台刷新，间隔：", interval, "分钟");
}

// 启动自动同步
export function startAutoSync() {
  if (typeof window === "undefined") return;

  // 执行初始同步
  performSync();

  // 设置定时器
  resetSyncInterval();

  // 添加清理函数
  window.addEventListener("beforeunload", stopAutoSync);
}

// 停止自动同步
export function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  window.removeEventListener("beforeunload", stopAutoSync);
}

// 同步函数
async function performSync() {
  if (isOnline.get() && !isSyncing.get()) {
    try {
      const lastSyncTime = getLastSyncTime();
      const now = new Date();
      const interval = parseInt(settingsState.get().syncInterval);

      if (!lastSyncTime || now - lastSyncTime > interval * 60 * 1000) {
        await sync();
      }
    } catch (error) {
      console.error("自动同步失败:", error);
    }
  }
}

// 手动强制同步,由侧边栏刷新按钮触发
export async function forceSync() {
  if (isOnline.get() && !isSyncing.get()) {
    try {
      await sync();
    } catch (error) {
      console.error("强制同步失败:", error);
    }
  }
}
