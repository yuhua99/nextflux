import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { loadFeeds } from "@/stores/feedsStore.js";
import { isSyncing, lastSync } from "@/stores/syncStore.js";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookOpenText } from "lucide-react";
import { formatLastSync } from "@/lib/format";
import { settingsState } from "@/stores/settingsStore.js";
import ArticlesGroup from "@/components/FeedList/components/ArticlesGroup.jsx";
import FeedsGroup from "@/components/FeedList/components/FeedsGroup.jsx";
import SyncButton from "@/components/FeedList/components/SyncButton.jsx";
import { ScrollShadow } from "@nextui-org/react";
import ProfileButton from "@/components/FeedList/components/ProfileButton.jsx";

const FeedListSidebar = () => {
  const $lastSync = useStore(lastSync);
  const $isSyncing = useStore(isSyncing);
  const { showHiddenFeeds } = useStore(settingsState);
  useEffect(() => {
    loadFeeds();
  }, [$lastSync, showHiddenFeeds]);

  return (
    <Sidebar variant="sidebar" className="sidebar">
      <SidebarHeader className="sidebar-header">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BookOpenText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ReactFlux</span>
                <span className="truncate text-xs text-content2-foreground">
                  {$isSyncing ? "同步中..." : formatLastSync($lastSync)}
                </span>
              </div>
              <SyncButton />
              <ProfileButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <ScrollShadow>
        <SidebarContent>
          <ArticlesGroup />
          <FeedsGroup />
        </SidebarContent>
      </ScrollShadow>
    </Sidebar>
  );
};

export default FeedListSidebar;
