import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CirclePlus, FolderPlus, Rss } from "lucide-react";
import { addCategoryModalOpen, addFeedModalOpen } from "@/stores/modalStore";
import { useSidebar } from "@/components/ui/sidebar.jsx";

export default function AddFeedButton() {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm" radius="full" variant="light" isIconOnly>
          <CirclePlus className="size-4 text-default-500" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="newFeed"
          startContent={<Rss className="size-4" />}
          onPress={() => {
            addFeedModalOpen.set(true);
            isMobile && setOpenMobile(false);
          }}
        >
          添加订阅源
        </DropdownItem>
        <DropdownItem
          key="newCategory"
          startContent={<FolderPlus className="size-4" />}
          onPress={() => {
            addCategoryModalOpen.set(true);
            isMobile && setOpenMobile(false);
          }}
        >
          新建分类
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
