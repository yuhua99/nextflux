import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
import { TriangleAlert } from "lucide-react";
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
      radius="md"
      size="sm"
      isOpen={isOpen}
      hideCloseButton
      onClose={onClose}
      classNames={{
        base: "alert-dialog relative",
        body: "px-4 py-4 items-center sm:flex-row sm:items-start",
        footer: "px-4 py-4 flex flex-col sm:flex-row",
      }}
    >
      <ModalContent>
        <ModalBody>
          <div className="absolute right-3 top-3">
            <MiniCloseButton onClose={onClose} />
          </div>
          <div className="danger-icon size-10 rounded-full bg-danger-50 content-center shrink-0">
            <TriangleAlert className="text-danger mx-auto mb-1" />
          </div>
          <div className="info space-y-3 w-full">
            <div className="font-semibold text-center sm:text-left">
              {title}
            </div>
            <div className="text-sm text-default-500 text-center sm:text-left">
              {content}
            </div>
          </div>
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
