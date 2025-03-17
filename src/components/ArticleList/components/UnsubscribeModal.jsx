import minifluxAPI from "@/api/miniflux";
import { unsubscribeModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate, useParams } from "react-router-dom";
import { feeds } from "@/stores/feedsStore";
import AlertDialog from "@/components/ui/AlertDialog.jsx";
import { useTranslation } from "react-i18next";
import {
  deleteArticlesByFeedId,
  deleteFeed,
  deleteFeedIcon,
} from "@/db/storage";
import { starredCounts, unreadCounts } from "@/stores/feedsStore";

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
      const feedIdInt = parseInt(feedId);
      // 从服务器删除订阅源
      await minifluxAPI.deleteFeed(feedId);
      // 从本地数据库删除相关数据
      await Promise.all([
        deleteArticlesByFeedId(feedIdInt),
        deleteFeed(feedIdInt),
        deleteFeedIcon(feedIdInt),
      ]);
      // 更新本地状态
      feeds.set($feeds.filter((feed) => feed.id !== feedIdInt));
      unreadCounts.set({
        ...unreadCounts.get(),
        [feedIdInt]: 0,
      });
      starredCounts.set({
        ...starredCounts.get(),
        [feedIdInt]: 0,
      });

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
