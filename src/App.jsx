import { Outlet } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import FeedListSidebar from "@/components/FeedList/FeedListSidebar.jsx";
import { authState } from "@/stores/authStore.js";
import { startAutoSync } from "@/stores/syncStore.js";
import { settingsState } from "@/stores/settingsStore.js";
import { useStore } from "@nanostores/react";
import Settings from "@/components/Settings/Settings.jsx";
import Shortcuts from "@/components/Settings/Shortcuts.jsx";
import AddFeedModal from "@/components/FeedList/components/AddFeedModal.jsx";
import AddCategoryModal from "@/components/FeedList/components/AddCategoryModal.jsx";
import { useHotkeys } from "@/hooks/useHotkeys.js";
import SearchModal from "@/components/Search/SearchModal.jsx";

function App() {
  const { syncInterval } = useStore(settingsState);
  useEffect(() => {
    // 检查认证状态并启动自动同步
    const auth = authState.get();
    if (auth.serverUrl && auth.username && auth.password) {
      startAutoSync();
    }
  }, [syncInterval]);

  useHotkeys();

  return (
    <SidebarProvider>
      <FeedListSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
      <Settings />
      <Shortcuts />
      <AddFeedModal />
      <AddCategoryModal />
      <SearchModal />
    </SidebarProvider>
  );
}

export default App;
