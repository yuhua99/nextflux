import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useState } from "react";
import { settingsModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import General from "@/components/Settings/General.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import Readability from "@/components/Settings/Readability.jsx";
import { Cog, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function App() {
  const isOpen = useStore(settingsModalOpen);
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useTranslation();
  return (
    <>
      <Modal
        isOpen={isOpen}
        radius="md"
        scrollBehavior="inside"
        disableAnimation
        onOpenChange={(value) => {
          settingsModalOpen.set(value);
          setActiveTab("general");
        }}
        classNames={{
          base: "m-2 standalone:mb-safe-or-2 max-h-[80vh] h-[600px] overflow-hidden bg-content2/90 dark:bg-content1/90 backdrop-blur-lg !shadow-custom",
          header:
            "border-b flex flex-col gap-3 p-3 bg-content1/80 dark:bg-transparent",
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
                    <span className="text-base font-medium">
                      {t("settings.title")}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    radius="full"
                    variant="light"
                    isIconOnly
                    onPress={() => {
                      settingsModalOpen.set(false);
                      setActiveTab("general");
                    }}
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
                    classNames={{
                      tabList:
                        "bg-default-100/90 shadow-custom-inner p-[1px] gap-0 rounded-small overflow-visible",
                      tab: "py-1 h-7 text-sm",
                      cursor: "bg-content1 !shadow-custom-cursor rounded-small",
                    }}
                    selectedKey={activeTab}
                    onSelectionChange={(key) => {
                      setActiveTab(key);
                      const modalBody = document.querySelector(".modal-body");
                      if (modalBody) {
                        modalBody.scrollTop = 0;
                      }
                    }}
                  >
                    <Tab key="general" title={t("settings.general.title")} />
                    <Tab
                      key="appearance"
                      title={t("settings.appearance.title")}
                    />
                    <Tab
                      key="readability"
                      title={t("settings.readability.title")}
                    />
                  </Tabs>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="p-3 overflow-y-auto flex flex-col gap-4">
                  {activeTab === "general" && <General />}
                  {activeTab === "appearance" && <Appearance />}
                  {activeTab === "readability" && <Readability />}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
