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
  Switch,
} from "@nextui-org/react";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { categories } from "@/stores/feedsStore";
import { addFeedModalOpen } from "@/stores/modalStore";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AddFeedModal() {
  const $categories = useStore(categories);
  const $addFeedModalOpen = useStore(addFeedModalOpen);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feed_url: "",
    category_id: "",
    crawler: false,
  });

  const onClose = () => {
    addFeedModalOpen.set(false);
    setFormData({
      feed_url: "",
      category_id: "",
      crawler: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await minifluxAPI.createFeed(
        formData.feed_url,
        formData.category_id,
        { crawler: formData.crawler },
      );
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
      // 导航到新增的订阅源
      console.log(response);
      navigate(`/feed/${response.feed_id}`);
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
                variant="faded"
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
                variant="faded"
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
                    {category.title}
                  </SelectItem>
                ))}
              </Select>
              <Switch
                name="crawler"
                size="sm"
                classNames={{
                  base: cn(
                    "inline-flex flex-row-reverse w-full max-w-md bg-content2 items-center shadow-sm transition-colors",
                    "justify-between cursor-pointer rounded-lg gap-2 py-1 pr-2 border-2 border-default-200",
                    "data-[hover=true]:border-default-400 data-[selected=true]:border-primary",
                  ),
                }}
                isSelected={formData.crawler}
                onValueChange={(value) =>
                  setFormData({ ...formData, crawler: value })
                }
              >
                <div className="flex flex-col w-full">
                  <div className="text-sm">获取全文</div>
                  <div className="text-xs text-default-500">
                    自动尝试抓取全文内容
                  </div>
                </div>
              </Switch>
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
