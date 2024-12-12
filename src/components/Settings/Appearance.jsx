import { settingsState } from "@/stores/settingsStore";
import { Divider } from "@nextui-org/react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import { Circle, Rss, Square } from "lucide-react";

export default function Appearance() {
  const { feedIconShape, useGrayIcon } = useStore(settingsState);
  return (
    <ItemWrapper title="订阅源图标">
      <SelItem
        label="形状"
        icon={
          feedIconShape === "circle" ? (
            <Circle className="shrink-0 size-4 text-default-500" />
          ) : (
            <Square className="shrink-0 size-4 text-default-500" />
          )
        }
        settingName="feedIconShape"
        settingValue={feedIconShape}
        options={[
          { value: "circle", label: "圆形" },
          { value: "square", label: "方形" },
        ]}
      />
      <Divider />
      <SwitchItem
        label="使用灰阶图标"
        icon={<Rss className="shrink-0 size-4 text-default-500" />}
        settingName="useGrayIcon"
        settingValue={useGrayIcon}
      />
    </ItemWrapper>
  );
}
