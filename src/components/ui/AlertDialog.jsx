import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
import { useState } from "react";

export default function AlertDialog({
  title,
  content,
  isOpen,
  onConfirm,
  onClose,
  cancelText = "取消",
  confirmText = "确定",
  confirmColor = "danger",
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("确认操作失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      placement="center"
      radius="md"
      size="sm"
      isOpen={isOpen}
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
          <div>{title}</div>
          <MiniCloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-500">{content}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} size="sm">
            {cancelText}
          </Button>
          <Button
            color={confirmColor}
            variant="flat"
            onPress={handleConfirm}
            isLoading={loading}
            size="sm"
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
