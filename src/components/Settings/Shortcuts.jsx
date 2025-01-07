import { ItemWrapper, KeyboardItem } from "@/components/ui/settingItem.jsx";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { shortcutsModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { Keyboard, X } from "lucide-react";

export default function Shortcuts() {
  const shortcuts = {
    article: [
      { key: "J", desc: "下一篇文章" },
      { key: "K", desc: "上一篇文章" },
      { key: "M", desc: "标记已读/未读" },
      { key: "S", desc: "收藏/取消收藏" },
      { key: "ESC", desc: "关闭文章" },
      { key: "V", desc: "在浏览器中查看" },
    ],
    global: [
      { key: "B", desc: "切换侧边栏", kbdKey: ["ctrl"] },

      {
        key: "/",
        desc: "查看/隐藏快捷键",
        kbdKey: ["ctrl"],
      },
      { key: "R", desc: "刷新" },
      { key: "F", desc: "全局搜索" },
    ],
  };
  const isOpen = useStore(shortcutsModalOpen);
  return (
    <>
      <Modal
        isOpen={isOpen}
        radius="md"
        scrollBehavior="inside"
        onOpenChange={(value) => {
          shortcutsModalOpen.set(value);
        }}
        classNames={{
          base: "settings-modal m-2 max-h-[80vh] h-[612px] overflow-hidden bg-content2 dark:bg-content1 dark:border",
          header: "border-b flex flex-col gap-3 p-3 bg-content1",
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
                    <Keyboard className="size-4" />
                    <span className="text-base font-medium">快捷键</span>
                  </div>
                  <Button
                    size="sm"
                    radius="full"
                    variant="light"
                    isIconOnly
                    onPress={() => {
                      shortcutsModalOpen.set(false);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="p-3 overflow-y-auto flex flex-col gap-4">
                  <ItemWrapper title="全局">
                    {shortcuts.global.map((shortcut, index) => (
                      <>
                        <KeyboardItem
                          key={shortcut.key}
                          keyStr={shortcut.key}
                          kbdKey={shortcut.kbdKey}
                          desc={shortcut.desc}
                        />
                        {index !== shortcuts.global.length - 1 && <Divider />}
                      </>
                    ))}
                  </ItemWrapper>
                  <ItemWrapper title="文章详情">
                    {shortcuts.article.map((shortcut, index) => (
                      <>
                        <KeyboardItem
                          key={shortcut.key}
                          keyStr={shortcut.key}
                          desc={shortcut.desc}
                        />
                        {index !== shortcuts.article.length - 1 && <Divider />}
                      </>
                    ))}
                  </ItemWrapper>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
