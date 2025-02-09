import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { FolderPen } from "lucide-react";
import { currentFeed, currentCategory, renameModalOpen } from "@/stores/modalStore";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import { useStore } from "@nanostores/react";

export default function CategoryContextMenu({ category, children }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const $currentCategory = useStore(currentCategory);
  const { isMedium } = useIsMobile();
  const { isMobile, setOpenMobile } = useSidebar();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if ($currentCategory?.id !== category.id) {
      setIsOpen(false);
    }
  }, [$currentCategory, category.id]);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      triggerScaleOnOpen={false}
      placement={isMedium ? "bottom-start" : "right"}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
      }}
    >
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ x: e.clientX, y: e.clientY });
          setIsOpen(true);
          currentCategory.set(category);
          currentFeed.set(null);
        }}
      >
        {children}
      </div>
      <DropdownMenu aria-label="Feed Actions" onClose={() => setIsOpen(false)}>
        <DropdownSection
          showDivider={false}
          title={category.title}
          classNames={{ base: "m-0" }}
        >
          <DropdownItem
            key="rename"
            onPress={() => {
              renameModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
            startContent={<FolderPen className="size-4 text-default-500" />}
          >
            {t("articleList.renameCategory.title")}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
