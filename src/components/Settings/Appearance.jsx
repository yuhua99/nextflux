import { settingsState } from "@/stores/settingsStore";
import { Divider } from "@nextui-org/react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import {
  Circle,
  CircleDashed,
  LayoutList,
  Rss,
  Square,
  Text,
} from "lucide-react";

export default function Appearance() {
  const {
    feedIconShape,
    useGrayIcon,
    cardImageSize,
    showFavicon,
    showTextPreview,
  } = useStore(settingsState);
  return (
    <>
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
          icon={<CircleDashed className="shrink-0 size-4 text-default-500" />}
          settingName="useGrayIcon"
          settingValue={useGrayIcon}
        />
      </ItemWrapper>
      <ItemWrapper title="文章卡片">
        <SelItem
          label="缩略图"
          icon={<LayoutList className="shrink-0 size-4 text-default-500" />}
          settingName="cardImageSize"
          settingValue={cardImageSize}
          options={[
            { value: "none", label: "不显示" },
            { value: "small", label: "小" },
            { value: "large", label: "大" },
          ]}
        />
        <Divider />
        <SwitchItem
          label="显示订阅源图标"
          icon={<Rss className="shrink-0 size-4 text-default-500" />}
          settingName="showFavicon"
          settingValue={showFavicon}
        />
        <Divider />
        <SwitchItem
          label="显示内容预览"
          icon={<Text className="shrink-0 size-4 text-default-500" />}
          settingName="showTextPreview"
          settingValue={showTextPreview}
        />
      </ItemWrapper>
    </>
  );
}
