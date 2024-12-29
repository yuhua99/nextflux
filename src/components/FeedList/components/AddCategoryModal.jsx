import {
  Button,
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
import { categories } from "@/stores/feedsStore";
import { toast } from "sonner";
import CategoryChip from "./CategoryChip.jsx";

export default function AddCategoryModal() {
  const $addCategoryModalOpen = useStore(addCategoryModalOpen);
  const $categories = useStore(categories);
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
              variant="faded"
              name="title"
              placeholder="请输入分类名称"
              errorMessage="请输入分类名称"
              value={title}
              onValueChange={setTitle}
            />
            <Divider className="my-2" />
            <div className="flex flex-wrap gap-2 p-3 bg-content2 rounded-lg">
              {$categories.map((category) => (
                <CategoryChip key={category.id} category={category} />
              ))}
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
