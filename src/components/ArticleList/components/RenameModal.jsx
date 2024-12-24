import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { renameModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useParams } from "react-router-dom";
import { categories } from "@/stores/feedsStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";

export default function RenameModal() {
  const $categories = useStore(categories);
  const { categoryId } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const $renameModalOpen = useStore(renameModalOpen);

  useEffect(() => {
    setNewTitle($categories.find((c) => c.id === parseInt(categoryId))?.title);
  }, [$categories, categoryId]);

  const onClose = () => {
    renameModalOpen.set(false);
    setNewTitle($categories.find((c) => c.id === parseInt(categoryId))?.title);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.updateCategory(categoryId, newTitle);
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
    } catch (error) {
      console.error("重命名分类失败:", error);
    } finally {
      setLoading(false);
      setNewTitle(""); // 重置输入框
    }
  };

  return (
    <Modal
      placement="center"
      radius="md"
      size="sm"
      isOpen={$renameModalOpen}
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
          <div>重命名分类</div>
          <MiniCloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody>
          <Form
            ref={formRef}
            className="w-full justify-center items-center  space-y-4"
            validationBehavior="native"
            onSubmit={(e) => handleRename(e)}
          >
            <div className="flex flex-col gap-4 w-full">
              <Input
                isRequired
                size="sm"
                label="分类名称"
                name="title"
                placeholder="请输入分类名称"
                errorMessage="请输入分类名称"
                value={newTitle}
                onValueChange={setNewTitle}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} size="sm">
            取消
          </Button>
          <Button
            color="primary"
            onPress={() => formRef.current?.requestSubmit()}
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
