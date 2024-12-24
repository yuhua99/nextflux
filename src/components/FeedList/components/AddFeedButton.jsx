import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CirclePlus, FolderPlus, Rss } from "lucide-react";
import { addCategoryModalOpen, addFeedModalOpen } from "@/stores/modalStore";

export default function AddFeedButton() {
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
          onPress={() => addFeedModalOpen.set(true)}
        >
          添加订阅源
        </DropdownItem>
        <DropdownItem
          key="newCategory"
          startContent={<FolderPlus className="size-4" />}
          onPress={() => addCategoryModalOpen.set(true)}
        >
          新建分类
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
