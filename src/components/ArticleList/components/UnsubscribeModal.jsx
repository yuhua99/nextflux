import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { unsubscribeModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate, useParams } from "react-router-dom";
import { feeds } from "@/stores/feedsStore";
import AlertDialog from "@/components/ui/AlertDialog.jsx";
export default function UnsubscribeModal() {
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
      title="取消订阅"
      content={`确定要取消订阅「${feedTitle}」吗？此操作无法撤销。`}
      isOpen={$unsubscribeModalOpen}
      onConfirm={handleUnsubscribe}
      onClose={onClose}
    />
  );
}