import { filter } from "@/stores/articlesStore";
import { CircleDot, Infinity, Star } from "lucide-react";
import { Tab, Tabs } from "@nextui-org/react";
import { useStore } from "@nanostores/react";
import AudioPlayer from "@/components/ArticleView/components/AudioPlayer.jsx";
import { activeAudio } from "@/stores/audioStore.js";
import { AnimatePresence } from "framer-motion";

export default function ArticleListFooter() {
  const $filter = useStore(filter);
  const $activeAudio = useStore(activeAudio);

  return (
    <div className="article-list-footer absolute bottom-0 w-full bg-transparent flex flex-col items-center justify-center pb-4">
      <AnimatePresence initial={false} mode="wait">
        {$activeAudio && <AudioPlayer source={$activeAudio} />}
      </AnimatePresence>
      <Tabs
        aria-label="filter"
        size="sm"
        variant="solid"
        radius="full"
        classNames={{
          tabList: "bg-content3/90 backdrop-blur-md",
          cursor: "w-full bg-default-400/90 shadow-none dark:bg-primary",
          tabContent:
            "text-default-500 font-semibold group-data-[selected=true]:text-default-50 dark:group-data-[selected=true]:text-foreground",
        }}
        selectedKey={$filter}
        onSelectionChange={(value) => {
          filter.set(value);
        }}
      >
        <Tab
          key="starred"
          title={
            <div className="flex items-center space-x-1.5">
              <Star className="size-3" />
              <span>收藏</span>
            </div>
          }
        />
        <Tab
          key="unread"
          title={
            <div className="flex items-center space-x-1.5">
              <CircleDot className="size-3" />
              <span>未读</span>
            </div>
          }
        />
        <Tab
          key="all"
          title={
            <div className="flex items-center space-x-1.5">
              <Infinity className="size-3" />
              <span>全部</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
