import { Chip } from "@nextui-org/react";
import { cn } from "@/lib/utils.js";
import { Loader2, X } from "lucide-react";
import { feeds } from "@/stores/feedsStore.js";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import minifluxAPI from "@/api/miniflux.js";
import { forceSync } from "@/stores/syncStore.js";
import { toast } from "sonner";

export default function CategoryChip({ category }) {
  const [loading, setLoading] = useState(false);
  const $feeds = useStore(feeds);
  const hasFeeds = $feeds.some((feed) => feed.categoryId === category.id);

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await minifluxAPI.deleteCategory(categoryId);
      await forceSync();
      toast.success("删除成功");
    } catch (error) {
      console.error("删除分类失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Chip
      key={category.id}
      variant="flat"
      size="sm"
      endContent={
        !hasFeeds ? (
          <span
            className={cn(
              "text-xs size-4 flex items-center justify-center rounded-full p-1 ml-1 text-content2-foreground",
              loading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-default-100",
            )}
            onClick={
              loading ? undefined : () => handleDeleteCategory(category.id)
            }
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </span>
        ) : null
      }
    >
      {category.title}
    </Chip>
  );
}
