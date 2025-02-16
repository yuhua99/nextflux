import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { FilePen, Trash2, RefreshCw } from "lucide-react";
import {
  currentFeed,
  currentCategory,
  editFeedModalOpen,
  unsubscribeModalOpen,
} from "@/stores/modalStore";
import { handleRefresh } from "@/handlers/feedHandlers";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import { useStore } from "@nanostores/react";
export default function FeedContextMenu({ feed, children }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const $currentFeed = useStore(currentFeed);
  const { isMedium } = useIsMobile();
  const { isMobile, setOpenMobile } = useSidebar();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if ($currentFeed?.id !== feed.id) {
      setIsOpen(false);
    }
  }, [$currentFeed, feed.id]);

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
          currentFeed.set(feed);
          currentCategory.set(null);
        }}
      >
        {children}
      </div>
      <DropdownMenu
        aria-label="Feed Actions"
        variant="flat"
        onClose={() => setIsOpen(false)}
      >
        <DropdownSection
          showDivider={false}
          title={feed.title}
          classNames={{ base: "m-0" }}
        >
          <DropdownItem
            key="refresh"
            onPress={() => {
              handleRefresh(feed.id);
              isMobile && setOpenMobile(false);
            }}
            startContent={<RefreshCw className="size-4 text-default-500" />}
          >
            {t("articleList.refreshFeed")}
          </DropdownItem>
          <DropdownItem
            key="edit"
            onPress={() => {
              editFeedModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
            startContent={<FilePen className="size-4 text-default-500" />}
          >
            {t("articleList.editFeed")}
          </DropdownItem>
          <DropdownItem isDisabled classNames={{ base: "py-1.5" }}>
            <Divider />
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            variant="flat"
            onPress={() => {
              unsubscribeModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
            startContent={<Trash2 className="size-4" />}
          >
            {t("articleList.unsubscribe")}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
