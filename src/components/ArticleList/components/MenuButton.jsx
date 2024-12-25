import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { EllipsisVertical, FilePen, FolderPen, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import RenameModal from "./RenameModal";
import UnsubscribeModal from "./UnsubscribeModal";
import EditFeedModal from "./EditFeedModal";
import {
  editFeedModalOpen,
  renameModalOpen,
  unsubscribeModalOpen,
} from "@/stores/modalStore.js";

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
            <DropdownItem
              key="edit"
              onPress={() => editFeedModalOpen.set(true)}
              startContent={<FilePen className="size-4" />}
            >
              编辑订阅
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              variant="flat"
              onPress={() => unsubscribeModalOpen.set(true)}
              startContent={<Trash2 className="size-4" />}
            >
              取消订阅
            </DropdownItem>
          </DropdownMenu>
        )}
        {categoryId && (
          <DropdownMenu aria-label="Category Actions">
            <DropdownItem
              key="rename"
              onPress={() => renameModalOpen.set(true)}
              startContent={<FolderPen className="size-4" />}
            >
              重命名分类
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <RenameModal />
      <UnsubscribeModal />
      <EditFeedModal />
    </>
  );
}
