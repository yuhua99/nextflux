import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { CircleCheck } from "lucide-react";
import { isSyncing } from "@/stores/syncStore.js";
import { useStore } from "@nanostores/react";
import { filter, unreadArticlesCount } from "@/stores/articlesStore.js";
import { useTranslation } from "react-i18next";

export default function MarkAllReadButton() {
  const { t } = useTranslation();
  const { feedId, categoryId } = useParams();
  const $isSyncing = useStore(isSyncing);
  const $filter = useStore(filter);
  const $unreadArticlesCount = useStore(unreadArticlesCount);
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="sm"
          radius="full"
          variant="light"
          isIconOnly
          isDisabled={$filter === "starred" || $unreadArticlesCount === 0}
          isLoading={$isSyncing}
        >
          <CircleCheck className="size-4 text-default-500" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="markAllAsRead" variant="flat">
        <DropdownItem
          key="markAsRead"
          className="text-danger"
          color="danger"
          startContent={<CircleCheck className="size-4" />}
          onPress={() => {
            if (feedId) {
              handleMarkAllRead("feed", feedId);
            } else if (categoryId) {
              handleMarkAllRead("category", categoryId);
            } else {
              handleMarkAllRead();
            }
          }}
        >
          {t("articleList.markAllRead")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
