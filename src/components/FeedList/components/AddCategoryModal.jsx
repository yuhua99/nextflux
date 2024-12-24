import {
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { addCategoryModalOpen } from "@/stores/modalStore";
import { useStore } from "@nanostores/react";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton";
import { categories, feeds } from "@/stores/feedsStore";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AddCategoryModal() {
  const $addCategoryModalOpen = useStore(addCategoryModalOpen);
  const $categories = useStore(categories);
  const $feeds = useStore(feeds);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const onClose = () => {
    addCategoryModalOpen.set(false);
    setTitle("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.createCategory(title);
      await forceSync();
      onClose();
      toast.success("添加成功");
    } catch (error) {
      console.error("添加分类失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await minifluxAPI.deleteCategory(categoryId);
      await forceSync();
      toast.success("删除成功");
    } catch (error) {
      console.error("删除分类失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={$addCategoryModalOpen}
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
            <div>添加分类</div>
            <MiniCloseButton onClose={onClose} />
          </ModalHeader>
          <ModalBody>
            <Input
              isRequired
              size="sm"
              label="分类名称"
              name="title"
              placeholder="请输入分类名称"
              errorMessage="请输入分类名称"
              value={title}
              onValueChange={setTitle}
            />
            <Divider className="my-2" />
            <div className="flex gap-1 flex-wrap">
              {$categories.map((category, index) => {
                const hasFeeds = $feeds.some(
                  (feed) => feed.categoryId === category.id,
                );

                return (
                  <Chip
                    key={index}
                    className="mb-1"
                    variant="flat"
                    size="sm"
                    endContent={
                      !hasFeeds ? (
                        <span
                          className={cn(
                            "text-xs size-4 flex items-center justify-center rounded-full p-1 ml-1 text-content2-foreground",
                            loading
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:bg-default-100",
                          )}
                          onClick={
                            loading
                              ? undefined
                              : () => handleDeleteCategory(category.id)
                          }
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </span>
                      ) : null
                    }
                  >
                    {category.title}
                  </Chip>
                );
              })}
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
