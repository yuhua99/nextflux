import { settingsState } from "@/stores/settingsStore";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  CaseSensitive,
  PanelTopDashed,
  Type,
  UnfoldHorizontal,
  UnfoldVertical,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  GroupItem,
  ItemWrapper,
  SelItem,
  SliderItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import { Button, Divider } from "@nextui-org/react";
import { resetSettings } from "@/stores/settingsStore.js";

const fontOptions = [
  { label: "系统默认", value: "system-ui", style: { fontFamily: "system-ui" } },
  {
    label: "Sans-serif",
    value: "sans-serif",
    style: { fontFamily: "sans-serif" },
  },
  { label: "Serif", value: "serif", style: { fontFamily: "serif" } },
  {
    label: "思源宋体",
    value: "'Noto Serif SC'",
    style: { fontFamily: "'Noto Serif SC', serif" },
  },
  {
    label: "思源黑体",
    value: "'Noto Sans SC'",
    style: { fontFamily: "'Noto Sans SC', sans-serif" },
  },
  {
    label: "霞鹜文楷",
    value: "'LXGW WenKai'",
    style: { fontFamily: "'LXGW WenKai', serif" },
  },
];

export default function Readability() {
  const {
    lineHeight,
    fontSize,
    maxWidth,
    alignJustify,
    fontFamily,
    titleFontSize,
    titleAlignType,
    autoHideToolbar,
  } = useStore(settingsState);
  return (
    <>
      <ItemWrapper title="文章内容">
        <SwitchItem
          label="自动隐藏顶部工具栏"
          icon={<PanelTopDashed className="shrink-0 size-4 text-default-500" />}
          settingName="autoHideToolbar"
          settingValue={autoHideToolbar}
        />
        <Divider />
        <SelItem
          label="字体"
          icon={<Type className="shrink-0 size-4 text-default-500" />}
          settingName="fontFamily"
          settingValue={fontFamily}
          options={fontOptions}
        />
        <Divider />
        <SwitchItem
          label="使文本两端对齐"
          icon={<AlignJustify className="shrink-0 size-4 text-default-500" />}
          settingName="alignJustify"
          settingValue={alignJustify}
        />
        <Divider />
        <SliderItem
          label="行间距"
          icon={<UnfoldVertical className="shrink-0 size-4 text-default-500" />}
          settingName="lineHeight"
          settingValue={lineHeight}
          max={2.5}
          min={1.2}
          step={0.1}
        />
        <Divider />
        <SliderItem
          label="大小"
          icon={<CaseSensitive className="shrink-0 size-4 text-default-500" />}
          settingName="fontSize"
          settingValue={fontSize}
          max={24}
          min={14}
          step={2}
        />
        <Divider />
        <SliderItem
          label="最大宽度"
          icon={
            <UnfoldHorizontal className="shrink-0 size-4 text-default-500" />
          }
          settingName="maxWidth"
          settingValue={maxWidth}
          max={80}
          min={50}
          step={5}
        />
      </ItemWrapper>
      <ItemWrapper title="文章标题">
        <GroupItem
          label="对齐"
          icon={
            <AlignStartVertical className="shrink-0 size-4 text-default-500" />
          }
          settingName="titleAlignType"
          settingValue={titleAlignType}
          options={[
            { value: "left", icon: <AlignLeft className="size-4" /> },
            { value: "center", icon: <AlignCenter className="size-4" /> },
            { value: "right", icon: <AlignRight className="size-4" /> },
          ]}
        />
        <Divider />
        <SliderItem
          label="大小"
          icon={<CaseSensitive className="shrink-0 size-4 text-default-500" />}
          settingName="titleFontSize"
          settingValue={titleFontSize}
          max={3.0}
          min={1.0}
          step={0.2}
        />
      </ItemWrapper>
      <Button color="danger" variant="flat" onPress={resetSettings}>
        重 置
      </Button>
    </>
  );
}
