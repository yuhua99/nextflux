import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { unsubscribeModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate, useParams } from "react-router-dom";
import { feeds } from "@/stores/feedsStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
export default function UnsubscribeModal() {
  const $feeds = useStore(feeds);
  const { feedId } = useParams();
  const [loading, setLoading] = useState(false);
  const $unsubscribeModalOpen = useStore(unsubscribeModalOpen);
  const navigate = useNavigate();

  const feedTitle = $feeds.find((f) => f.id === parseInt(feedId))?.title;

  const onClose = () => {
    unsubscribeModalOpen.set(false);
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      await minifluxAPI.deleteFeed(feedId);
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
      navigate("/"); // 取消订阅后返回首页
    } catch (error) {
      console.error("取消订阅失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      placement="center"
      radius="md"
      size="sm"
      isOpen={$unsubscribeModalOpen}
      hideCloseButton
      onClose={onClose}
      classNames={{
        header: "px-4 py-3 flex justify-between text-base font-medium",
        body: "px-4 py-1",
        footer: "px-4 py-4",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div>取消订阅</div>
          <MiniCloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-500">
            {`确定要取消订阅「${feedTitle}」吗？此操作无法撤销。`}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} size="sm">
            取消
          </Button>
          <Button
            color="danger"
            variant="flat"
            onPress={handleUnsubscribe}
            isLoading={loading}
            size="sm"
          >
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
