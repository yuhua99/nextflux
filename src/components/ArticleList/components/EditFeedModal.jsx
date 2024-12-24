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
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { categories, feeds } from "@/stores/feedsStore";
import { editFeedModalOpen } from "@/stores/modalStore";
import { useParams } from "react-router-dom";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { cn } from "@/lib/utils";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function EditFeedModal() {
  const { feedId } = useParams();
  const $feeds = useStore(feeds);
  const $categories = useStore(categories);
  const $editFeedModalOpen = useStore(editFeedModalOpen);
  const [loading, setLoading] = useState(false);
  const [feedUrl, setFeedUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    hide_globally: false,
  });

  useEffect(() => {
    if (feedId) {
      const feed = $feeds.find((f) => f.id === parseInt(feedId));
      if (feed) {
        setFormData({
          title: feed.title,
          category_id: feed.categoryId,
          hide_globally: feed.hide_globally,
        });
        setFeedUrl(feed.url);
      }
    }
  }, [feedId, $feeds]);

  const onClose = () => {
    editFeedModalOpen.set(false);
    const feed = $feeds.find((f) => f.id === parseInt(feedId));
    setFormData({
      title: feed.title,
      category_id: feed.categoryId,
      hide_globally: feed.hide_globally,
    });
    setFeedUrl(feed.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.updateFeed(feedId, formData);
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
    } catch (error) {
      console.error("更新订阅源失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={$editFeedModalOpen}
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
            <div>编辑订阅源</div>
            <MiniCloseButton onClose={onClose} />
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                size="sm"
                label="订阅名称"
                name="title"
                placeholder="请输入订阅名称"
                errorMessage="请输入订阅名称"
                value={formData.title}
                onValueChange={(value) =>
                  setFormData({ ...formData, title: value })
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
                    {category.title}
                  </SelectItem>
                ))}
              </Select>
              <Switch
                name="hide_globally"
                size="sm"
                classNames={{
                  base: cn(
                    "inline-flex flex-row-reverse w-full max-w-md bg-content2 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 py-[6px] pr-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary",
                  ),
                }}
                checked={formData.hide_globally}
                onValueChange={(value) =>
                  setFormData({ ...formData, hide_globally: value })
                }
              >
                <div className="flex flex-col w-full">
                  <div className="text-sm">隐藏订阅源</div>
                  <div className="text-xs text-default-500">
                    隐藏订阅源默认不显示在订阅源列表中
                  </div>
                </div>
              </Switch>
              <div className="flex items-center gap-2 bg-content2 rounded-lg px-2 py-[6px]">
                <div className="flex flex-col w-full">
                  <div className="text-sm">订阅源地址</div>
                  <div className="text-xs text-default-500 line-clamp-1">
                    {feedUrl}
                  </div>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<Copy className="size-4 shrink-0" />}
                  onPress={() => {
                    navigator.clipboard.writeText(feedUrl);
                    toast.success("复制成功");
                  }}
                >
                  复制
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose} size="sm">
              取消
            </Button>
            <Button color="primary" type="submit" isLoading={loading} size="sm">
              保存
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
