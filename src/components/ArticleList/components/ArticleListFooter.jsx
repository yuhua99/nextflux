import { filter } from "@/stores/articlesStore";
import { CircleDot, Infinity, Star } from "lucide-react";
import { Tab, Tabs } from "@nextui-org/react";
import { useStore } from "@nanostores/react";

export default function ArticleListFooter() {
  const $filter = useStore(filter);
  return (
    <div className="article-list-footer absolute bottom-0 w-full bg-transparent flex items-center justify-center pb-4">
      <Tabs
        aria-label="filter"
        size="sm"
        variant="solid"
        radius="full"
        classNames={{
          tabList: "bg-background/80 backdrop-blur-sm",
        }}
        selectedKey={$filter}
        onSelectionChange={(value) => {
          filter.set(value);
        }}
      >
        <Tab
          key="starred"
          title={
            <div className="flex items-center space-x-2">
              <Star className="size-4" />
              <span>收藏</span>
            </div>
          }
        />
        <Tab
          key="unread"
          title={
            <div className="flex items-center space-x-2">
              <CircleDot className="size-4" />
              <span>未读</span>
            </div>
          }
        />
        <Tab
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <Infinity className="size-4" />
              <span>全部</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
