import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  ChevronsUpDown,
  Cog,
  ExternalLink,
  Keyboard,
  LogOut,
} from "lucide-react";
import { authState, logout } from "@/stores/authStore.js";
import { settingsModalOpen } from "@/stores/settingsStore.js";
import { shortcutsModalOpen } from "@/stores/modalStore.js";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import AlertDialog from "@/components/ui/AlertDialog.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProfileButton() {
  const { t } = useTranslation();
  const { username, serverUrl } = authState.get();
  const { isMobile, setOpenMobile } = useSidebar();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  return (
    <div className="profile-button flex items-center gap-4">
      <Dropdown>
        <DropdownTrigger>
          <Button
            size="sm"
            radius="sm"
            variant="light"
            className="h-auto p-2 w-full"
            endContent={<ChevronsUpDown className="size-4 text-default-500" />}
          >
            <div className="flex items-center w-full gap-2">
              <Avatar name={username} radius="sm" size="sm" />
              <div className="flex flex-col items-start">
                <div className="font-semibold">{username}</div>
                <div className="text-xs text-default-400 line-clamp-1">
                  {serverUrl}
                </div>
              </div>
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="settings"
            textValue="settings"
            startContent={<Cog className="size-4" />}
            onPress={() => {
              settingsModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
          >
            {t("sidebar.profile.settings")}
          </DropdownItem>
          <DropdownItem
            key="shortcuts"
            textValue="shortcuts"
            startContent={<Keyboard className="size-4" />}
            onPress={() => {
              shortcutsModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
          >
            {t("sidebar.shortcuts.title")}
          </DropdownItem>
          <DropdownItem
            key="open_miniflux"
            textValue="open_miniflux"
            startContent={<ExternalLink className="size-4" />}
            onPress={() => {
              window.open(serverUrl, "_blank");
            }}
          >
            {t("sidebar.profile.openMiniflux")}
          </DropdownItem>
          <DropdownItem
            key="logout"
            textValue="logout"
            color="danger"
            startContent={<LogOut className="size-4" />}
            onPress={() => setLogoutDialogOpen(true)}
          >
            {t("sidebar.profile.logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <AlertDialog
        title={t("sidebar.profile.logout")}
        content={t("sidebar.profile.logoutConfirmDescription")}
        isOpen={logoutDialogOpen}
        onConfirm={handleLogout}
        onClose={() => setLogoutDialogOpen(false)}
        confirmText={t("sidebar.profile.logout")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
