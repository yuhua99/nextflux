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
import { Image, ScrollShadow } from "@nextui-org/react";
import { formatLastSync } from "@/lib/format";
import { settingsState } from "@/stores/settingsStore.js";
import ArticlesGroup from "@/components/FeedList/components/ArticlesGroup.jsx";
import FeedsGroup from "@/components/FeedList/components/FeedsGroup.jsx";
import SyncButton from "@/components/FeedList/components/SyncButton.jsx";
import ProfileButton from "@/components/FeedList/components/ProfileButton.jsx";
import logo from "@/assets/logo.png";
import storage from "@/db/storage.js";

const FeedListSidebar = () => {
  const $lastSync = useStore(lastSync);
  const $isSyncing = useStore(isSyncing);
  const { showHiddenFeeds } = useStore(settingsState);

  useEffect(() => {
    lastSync.set(storage.getLastSyncTime());
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [$lastSync, showHiddenFeeds]);

  return (
    <Sidebar variant="sidebar" className="sidebar">
      <SidebarHeader className="sidebar-header">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Image src={logo} alt="logo" className="size-8 rounded" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ReactFlux</span>
                <span className="truncate text-xs text-default-400">
                  {$isSyncing ? "同步中..." : formatLastSync($lastSync)}
                </span>
              </div>
              <SyncButton />
              <ProfileButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollShadow>
          <ArticlesGroup />
          <FeedsGroup />
        </ScrollShadow>
      </SidebarContent>
    </Sidebar>
  );
};

export default FeedListSidebar;
