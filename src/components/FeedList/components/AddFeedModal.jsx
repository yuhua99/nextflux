import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { categoryState } from "@/stores/feedsStore";
import { addFeedModalOpen } from "@/stores/modalStore";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";

export default function AddFeedModal() {
  const $categories = useStore(categoryState);
  const $addFeedModalOpen = useStore(addFeedModalOpen);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    feed_url: "",
    category_id: "",
  });

  const onClose = () => {
    addFeedModalOpen.set(false);
    setFormData({
      feed_url: "",
      category_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.createFeed(formData.feed_url, formData.category_id);
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
    } catch (error) {
      console.error("添加订阅源失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={$addFeedModalOpen}
      onClose={onClose}
      placement="center"
      radius="md"
      size="sm"
      hideCloseButton
      classNames={{
        header: "px-4 py-3 flex justify-between text-base font-medium",
        body: "px-4 py-1",
        footer: "px-4 py-4",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <div>添加订阅源</div>
            <MiniCloseButton onClose={onClose} />
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                size="sm"
                label="订阅地址"
                name="feed_url"
                placeholder="请输入订阅地址"
                errorMessage="请输入订阅地址"
                value={formData.feed_url}
                onValueChange={(value) =>
                  setFormData({ ...formData, feed_url: value })
                }
              />
              <Select
                isRequired
                size="sm"
                label="分类"
                name="category_id"
                placeholder="请选择分类"
                errorMessage="请选择分类"
                selectedKeys={[formData.category_id?.toString()]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: parseInt(e.target.value),
                  })
                }
              >
                {$categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose} size="sm">
              取消
            </Button>
            <Button color="primary" type="submit" isLoading={loading} size="sm">
              添加
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
