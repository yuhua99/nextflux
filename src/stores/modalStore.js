import { atom } from "nanostores";

export const addFeedModalOpen = atom(false);
export const editFeedModalOpen = atom(false);
export const unsubscribeModalOpen = atom(false);
export const renameModalOpen = atom(false);
export const addCategoryModalOpen = atom(false);
export const shortcutsModalOpen = atom(false);
export const logoutModalOpen = atom(false);
export const aboutModalOpen = atom(false);
export const currentFeed = atom(null);
export const currentCategory = atom(null);
// 打开编辑模态框
export function openEditFeedModal(feed) {
  currentFeed.set(feed);
  editFeedModalOpen.set(true);
}

// 打开取消订阅模态框
export function openUnsubscribeModal(feed) {
  currentFeed.set(feed);
  unsubscribeModalOpen.set(true);
}

// 打开重命名模态框
export function openRenameModal(category) {
  currentCategory.set(category);
  renameModalOpen.set(true);
}
