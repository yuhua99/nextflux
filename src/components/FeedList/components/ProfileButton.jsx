import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CircleUser, Cog, LogOut } from "lucide-react";
import { authState, logout } from "@/stores/authStore.js";
import { settingsModalOpen } from "@/stores/settingsStore.js";
import { useSidebar } from "@/components/ui/sidebar.jsx";

export default function ProfileButton() {
  const { username } = authState.get();
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button size="sm" radius="full" variant="light" isIconOnly>
            <CircleUser className="size-4 text-default-500" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" textValue="profile" className="gap-2">
            <div className="font-semibold">当前账户</div>
            <div className="font-semibold">{username}</div>
          </DropdownItem>
          <DropdownItem
            key="settings"
            textValue="settings"
            startContent={<Cog className="size-4" />}
            onPress={() => {
              settingsModalOpen.set(true);
              isMobile && setOpenMobile(false);
            }}
          >
            设置
          </DropdownItem>
          <DropdownItem
            key="logout"
            textValue="logout"
            color="danger"
            startContent={<LogOut className="size-4" />}
            onPress={() => logout()}
          >
            注销
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
