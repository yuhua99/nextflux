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
import { categoryState } from "@/stores/feedsStore";

export default function RenameModal() {
  const $categoryState = useStore(categoryState);
  const { categoryId } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const $renameModalOpen = useStore(renameModalOpen);

  useEffect(() => {
    setNewTitle(
      $categoryState.find((c) => c.id === parseInt(categoryId))?.name,
    );
  }, [$categoryState, categoryId]);

  const onClose = () => {
    renameModalOpen.set(false);
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
      isOpen={$renameModalOpen}
      hideCloseButton
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">重命名分类</ModalHeader>
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
                label="分类名称"
                labelPlacement="outside"
                name="name"
                placeholder="请输入分类名称"
                errorMessage="请输入分类名称"
                value={newTitle}
                onValueChange={setNewTitle}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            onPress={() => formRef.current?.requestSubmit()}
            isLoading={loading}
          >
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
