import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CirclePlus, FolderPlus, Rss, Upload } from "lucide-react";
import { addCategoryModalOpen, addFeedModalOpen } from "@/stores/modalStore";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import { useRef } from "react";
import minifluxAPI from "@/api/miniflux";
import { toast } from "sonner";
import { forceSync } from "@/stores/syncStore";

export default function AddFeedButton() {
  const { isMobile, setOpenMobile } = useSidebar();
  const fileInputRef = useRef(null);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await minifluxAPI.importOPML(file);
      await forceSync(); // 重新加载订阅源列表以更新UI
      toast.success("OPML导入成功");
    } catch (error) {
      console.error("OPML导入失败:", error);
      toast.error("OPML导入失败");
    } finally {
      // 清空文件输入框,以便重复选择同一文件
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".opml,.xml"
        onChange={handleFileChange}
        className="hidden"
      />
      
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
            key="importOPML" 
            startContent={<Upload className="size-4" />}
            onPress={() => {
              fileInputRef.current?.click();
              isMobile && setOpenMobile(false);
            }}
          >
            导入OPML
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
    </>
  );
}
