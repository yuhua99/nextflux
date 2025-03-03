import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { unsubscribeModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate, useParams } from "react-router-dom";
import { feeds } from "@/stores/feedsStore";
import AlertDialog from "@/components/ui/AlertDialog.jsx";
import { useTranslation } from "react-i18next"; 

export default function UnsubscribeModal() {
  const { t } = useTranslation();
  const $feeds = useStore(feeds);
  const { feedId } = useParams();
  const $unsubscribeModalOpen = useStore(unsubscribeModalOpen);
  const navigate = useNavigate();

  const feedTitle = $feeds.find((f) => f.id === parseInt(feedId))?.title;

  const onClose = () => {
    unsubscribeModalOpen.set(false);
  };

  const handleUnsubscribe = async () => {
    try {
      await minifluxAPI.deleteFeed(feedId);
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