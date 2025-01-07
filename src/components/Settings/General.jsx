import { settingsState } from "@/stores/settingsStore";
import {
  CircleCheck,
  ClockArrowDown,
  ClockArrowUp,
  Eye,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import { Divider } from "@nextui-org/react";

export default function General() {
  const {
    sortDirection,
    showHiddenFeeds,
    markAsReadOnScroll,
    syncInterval,
    defaultExpandCategory,
  } = useStore(settingsState);

  return (
    <>
      <ItemWrapper title="同步">
        <SelItem
          label="自动同步间隔"
          icon={<RefreshCw className="shrink-0 size-4 text-default-500" />}
          settingName="syncInterval"
          settingValue={syncInterval}
          options={[
            { value: "0", label: "关闭" },
            { value: "5", label: "5分钟" },
            { value: "15", label: "15分钟" },
            { value: "30", label: "30分钟" },
            { value: "60", label: "1小时" },
          ]}
        />
      </ItemWrapper>
      <ItemWrapper title="订阅源">
        <SwitchItem
          label="显示隐藏的订阅源"
          icon={<Eye className="shrink-0 size-4 text-default-500" />}
          settingName="showHiddenFeeds"
          settingValue={showHiddenFeeds}
        />
        <Divider />
        <SwitchItem
          label="默认展开分类"
          icon={<FolderOpen className="shrink-0 size-4 text-default-500" />}
          settingName="defaultExpandCategory"
          settingValue={defaultExpandCategory}
        />
      </ItemWrapper>
      <ItemWrapper title="文章列表">
        <SelItem
          label="排序"
          icon={
            sortDirection === "desc" ? (
              <ClockArrowDown className="shrink-0 size-4 text-default-500" />
            ) : (
              <ClockArrowUp className="shrink-0 size-4 text-default-500" />
            )
          }
          settingName="sortDirection"
          settingValue={sortDirection}
          options={[
            { value: "desc", label: "新文章优先" },
            { value: "asc", label: "旧文章优先" },
          ]}
        />
        <Divider />
        <SwitchItem
          label="滚动标记为已读"
          icon={<CircleCheck className="shrink-0 size-4 text-default-500" />}
          settingName="markAsReadOnScroll"
          settingValue={markAsReadOnScroll}
        />
      </ItemWrapper>
    </>
  );
}
