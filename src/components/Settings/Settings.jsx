import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { resetSettings, settingsModalOpen } from "@/stores/settingsStore.js";
import { useStore } from "@nanostores/react";
import General from "@/components/Settings/General.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import Readability from "@/components/Settings/Readability.jsx";
import { X } from "lucide-react";

export default function App() {
  const isOpen = useStore(settingsModalOpen);

  return (
    <>
      <Modal
        isOpen={isOpen}
        radius="md"
        scrollBehavior="inside"
        onOpenChange={(value) => settingsModalOpen.set(value)}
        classNames={{
          base: "settings-modal m-2 max-h-[80vh] overflow-hidden bg-content2 dark:bg-background dark:border border-divider",
          header:
            "border-b border-divider p-3 flex items-center justify-between",
          footer: "hidden",
          body: "modal-body p-0 !block",
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <span>设置</span>
                <Button
                  size="sm"
                  radius="full"
                  variant="light"
                  isIconOnly
                  onPress={() => settingsModalOpen.set(false)}
                >
                  <X className="size-3" />
                </Button>
              </ModalHeader>
              <ModalBody>
                <div className="p-3 overflow-y-auto flex flex-col gap-4">
                  <General />
                  <Appearance />
                  <Readability />
                  <Button color="danger" variant="flat" onPress={resetSettings}>
                    重 置
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
