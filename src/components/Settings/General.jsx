import { settingsState } from "@/stores/settingsStore";
import { CircleCheck, ClockArrowDown, ClockArrowUp, Eye } from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import { Divider } from "@nextui-org/react";

export default function General() {
  const { sortDirection, showHiddenFeeds, markAsReadOnScroll } =
    useStore(settingsState);

  return (
    <>
      <ItemWrapper title="订阅源">
        <SwitchItem
          label="显示隐藏的订阅源"
          icon={<Eye className="shrink-0 size-4 text-default-500" />}
          settingName="showHiddenFeeds"
          settingValue={showHiddenFeeds}
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
