import { useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { isSyncing } from "@/stores/syncStore.js";
import { useStore } from "@nanostores/react";
import { filter, unreadArticlesCount } from "@/stores/articlesStore.js";
import { CheckCheck, Loader2 } from "lucide-react";

export default function MarkAllReadButtonAlt() {
  const { feedId, categoryId } = useParams();
  const $isSyncing = useStore(isSyncing);
  const $filter = useStore(filter);
  const $unreadArticlesCount = useStore(unreadArticlesCount);
  return (
    <Button
      size="sm"
      variant="flat"
      isDisabled={$filter === "starred" || $unreadArticlesCount === 0}
      fullWidth
      startContent={
        $isSyncing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CheckCheck className="size-4" />
        )
      }
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
      全部标记为已读
    </Button>
  );
}
