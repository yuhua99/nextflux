import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { FolderPen } from "lucide-react";
import { openRenameModal } from "@/stores/modalStore";
import { useSidebar } from "@/components/ui/sidebar.jsx";

export default function CategoryContextMenu({ category, children }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isMedium } = useIsMobile();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      triggerScaleOnOpen={false}
      showArrow
      placement={isMedium ? "bottom-start" : "right"}
      crossOffset={isMedium ? 24 : 0}
    >
      <DropdownTrigger>
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          {children}
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Feed Actions"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DropdownSection
          showDivider={false}
          title={category.title}
          classNames={{ base: "m-0" }}
        >
          <DropdownItem
            key="rename"
            onPress={() => {
              openRenameModal(category);
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
