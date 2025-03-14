import { atom, computed } from "nanostores";

export const addFeedModalOpen = atom(false);
export const editFeedModalOpen = atom(false);
export const unsubscribeModalOpen = atom(false);
export const renameModalOpen = atom(false);
export const addCategoryModalOpen = atom(false);
export const shortcutsModalOpen = atom(false);
export const logoutModalOpen = atom(false);
export const aboutModalOpen = atom(false);
export const searchDialogOpen = atom(false);
export const settingsModalOpen = atom(false);


export const isModalOpen = computed([
  addFeedModalOpen,
  editFeedModalOpen,
  unsubscribeModalOpen,
  renameModalOpen,
  addCategoryModalOpen,
  shortcutsModalOpen,
  logoutModalOpen,
  aboutModalOpen,
  searchDialogOpen,
  settingsModalOpen,
], (...args) => {
  return args.some(Boolean);
});
