import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useState } from "react";
import { settingsModalOpen } from "@/stores/settingsStore.js";
import { useStore } from "@nanostores/react";
import General from "@/components/Settings/General.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import Readability from "@/components/Settings/Readability.jsx";
import { Cog, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const isOpen = useStore(settingsModalOpen);
  const [activeTab, setActiveTab] = useState("general");
  return (
    <>
      <Modal
        isOpen={isOpen}
        radius="md"
        scrollBehavior="inside"
        onOpenChange={(value) => settingsModalOpen.set(value)}
        classNames={{
          base: "settings-modal m-2 max-h-[80vh] h-[600px] overflow-hidden bg-content2 dark:bg-background dark:border",
          header: "border-b flex flex-col gap-3 p-3 bg-background",
          footer: "hidden",
          body: "modal-body p-0 !block",
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex gap-2 justify-between">
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
                </div>
                <div>
                  <Tabs
                    aria-label="Tabs"
                    size="mini"
                    radius="sm"
                    fullWidth
                    classNames={{ tab: "py-0 h-6" }}
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key)}
                  >
                    <Tab key="general" title="通用" />
                    <Tab key="appearance" title="外观" />
                    <Tab key="readability" title="阅读" />
                  </Tabs>
                </div>
              </ModalHeader>
              <ModalBody>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 overflow-y-auto flex flex-col gap-4"
                  >
                    {activeTab === "general" && <General />}
                    {activeTab === "appearance" && <Appearance />}
                    {activeTab === "readability" && <Readability />}
                  </motion.div>
                </AnimatePresence>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
