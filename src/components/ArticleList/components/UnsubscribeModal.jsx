import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { unsubscribeModalOpen, currentFeed } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";
import AlertDialog from "@/components/ui/AlertDialog.jsx";
import { useTranslation } from "react-i18next";

export default function UnsubscribeModal() {
  const { t } = useTranslation();
  const $currentFeed = useStore(currentFeed);
  const $unsubscribeModalOpen = useStore(unsubscribeModalOpen);
  const navigate = useNavigate();

  const feedTitle = $currentFeed?.title;

  const onClose = () => {
    unsubscribeModalOpen.set(false);
  };

  const handleUnsubscribe = async () => {
    try {
      await minifluxAPI.deleteFeed($currentFeed.id);
      await forceSync(); // 重新加载订阅源列表以更新UI
      navigate("/"); // 取消订阅后返回首页
    } catch (error) {
      console.error("取消订阅失败:", error);
    }
  };

  return (
    <AlertDialog
      title={t("articleList.unsubscribe")}
      content={`${t("articleList.unsubscribeDescription")}「${feedTitle}」`}
      isOpen={$unsubscribeModalOpen}
      onConfirm={handleUnsubscribe}
      onClose={onClose}
      confirmText={t("common.confirm")}
      cancelText={t("common.cancel")}
    />
  );
}
