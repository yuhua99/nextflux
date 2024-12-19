import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { markAllAsRead } from "@/stores/articlesStore";
import { CircleCheck } from "lucide-react";
import { isSyncing } from "@/stores/syncStore.js";
import { useStore } from "@nanostores/react";

export default function MarkAllReadButton() {
  const { feedId, categoryId } = useParams();
  const $isSyncing = useStore(isSyncing);

  const handleMarkAllRead = async (type) => {
    try {
      switch (type) {
        case "feed":
          await markAllAsRead("feed", feedId);
          break;
        case "category":
          await markAllAsRead("category", categoryId);
          break;
        default:
          await markAllAsRead();
      }
    } catch (err) {
      console.error("标记已读失败:", err);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="sm"
          radius="full"
          variant="light"
          isIconOnly
          isLoading={$isSyncing}
        >
          <CircleCheck className="size-4 text-default-500" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="标记为已读" variant="flat">
        <DropdownItem
          key="markAsRead"
          className="text-danger"
          color="danger"
          onPress={() => {
            if (feedId) {
              handleMarkAllRead("feed");
            } else if (categoryId) {
              handleMarkAllRead("category");
            } else {
              handleMarkAllRead();
            }
          }}
        >
          {feedId
            ? "标记当前订阅源为已读"
            : categoryId
              ? "标记当前分类为已读"
              : "标记所有文章为已读"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
