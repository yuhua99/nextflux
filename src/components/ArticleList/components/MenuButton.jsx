import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "react-router-dom";
import RenameModal from "./RenameModal";
import { renameModalOpen } from "@/stores/modalStore.js";

export default function MenuButton() {
  const { feedId, categoryId } = useParams();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            size="sm"
            radius="full"
            variant="light"
            isIconOnly
            isDisabled={!feedId && !categoryId}
          >
            <EllipsisVertical className="size-4 text-default-500" />
          </Button>
        </DropdownTrigger>
        {feedId && (
          <DropdownMenu aria-label="Feed Actions">
            <DropdownItem key="edit">编辑</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              删除
            </DropdownItem>
          </DropdownMenu>
        )}
        {categoryId && (
          <DropdownMenu aria-label="Category Actions">
            <DropdownItem
              key="rename"
              onPress={() => renameModalOpen.set(true)}
            >
              重命名
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <RenameModal />
    </>
  );
}
