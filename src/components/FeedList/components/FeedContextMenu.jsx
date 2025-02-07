import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Divider,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { FilePen, Trash2, RefreshCw } from "lucide-react";
import { openEditFeedModal, openUnsubscribeModal } from "@/stores/modalStore";
import { handleRefresh } from "@/handlers/feedHandlers";
import { useSidebar } from "@/components/ui/sidebar.jsx";

export default function FeedContextMenu({ feed, children }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isMedium } = useIsMobile();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
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
      <DropdownMenu aria-label="Feed Actions" onClose={() => setIsOpen(false)}>
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
              openEditFeedModal(feed);
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
              openUnsubscribeModal(feed);
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
