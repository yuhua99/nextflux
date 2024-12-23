import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { resetSettings, settingsModalOpen } from "@/stores/settingsStore.js";
import { useStore } from "@nanostores/react";
import General from "@/components/Settings/General.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import Readability from "@/components/Settings/Readability.jsx";
import { Cog, X } from "lucide-react";

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
          base: "settings-modal m-2 max-h-[80vh] overflow-hidden bg-content2 dark:bg-background dark:border",
          header: "border-b p-3 flex items-center justify-between",
          footer: "hidden",
          body: "modal-body p-0 !block",
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-2">
                  <Cog className="size-4" />
                  <span className="text-base font-medium">设置</span>
                </div>
                <Button
                  size="sm"
                  radius="full"
                  variant="light"
                  isIconOnly
                  onPress={() => settingsModalOpen.set(false)}
                >
                  <X className="size-4" />
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
