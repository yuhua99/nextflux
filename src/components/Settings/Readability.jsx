import { settingsState } from "@/stores/settingsStore";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
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
import { Button, Divider } from "@heroui/react";
import { resetSettings } from "@/stores/settingsStore.js";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const fontOptions = [
    {
      label: t("settings.readability.systemFont"),
      value: "system-ui",
      style: { fontFamily: "system-ui" },
    },
    {
      label: t("settings.readability.sansSerif"),
      value: "sans-serif",
      style: { fontFamily: "sans-serif" },
    },
    {
      label: t("settings.readability.serif"),
      value: "serif",
      style: { fontFamily: "serif" },
    },
    {
      label: t("settings.readability.notoSerifSC"),
      value: "'Noto Serif SC'",
      style: { fontFamily: "'Noto Serif SC', serif" },
    },
    {
      label: t("settings.readability.notoSansSC"),
      value: "'Noto Sans SC'",
      style: { fontFamily: "'Noto Sans SC', sans-serif" },
    },
    {
      label: t("settings.readability.lxgwWenKai"),
      value: "'LXGW WenKai'",
      style: { fontFamily: "'LXGW WenKai', serif" },
    },
  ];
  return (
    <>
      <ItemWrapper title={t("settings.readability.text")}>
        <SwitchItem
          label={t("settings.readability.autoHideToolbar")}
          icon={<PanelTopDashed className="shrink-0 size-4 text-default-500" />}
          settingName="autoHideToolbar"
          settingValue={autoHideToolbar}
        />
        <Divider />
        <SelItem
          label={t("settings.readability.font")}
          icon={<Type className="shrink-0 size-4 text-default-500" />}
          settingName="fontFamily"
          settingValue={fontFamily}
          options={fontOptions}
        />
        <Divider />
        <SwitchItem
          label={t("settings.readability.textAlignJustify")}
          icon={<AlignJustify className="shrink-0 size-4 text-default-500" />}
          settingName="alignJustify"
          settingValue={alignJustify}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.lineHeight")}
          icon={<UnfoldVertical className="shrink-0 size-4 text-default-500" />}
          settingName="lineHeight"
          settingValue={lineHeight}
          max={2.5}
          min={1.2}
          step={0.1}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.fontSize")}
          icon={<CaseSensitive className="shrink-0 size-4 text-default-500" />}
          settingName="fontSize"
          settingValue={fontSize}
          max={24}
          min={14}
          step={2}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.maxWidth")}
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
      <ItemWrapper title={t("settings.readability.articleTitle")}>
        <GroupItem
          label={t("settings.readability.titleAlign")}
          icon={
            <AlignStartVertical className="shrink-0 size-4 text-default-500" />
          }
          settingName="titleAlignType"
          settingValue={titleAlignType}
          options={[
            { value: "left", icon: <AlignLeft className="size-4" /> },
            { value: "center", icon: <AlignCenter className="size-4" /> },
          ]}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.titleFontSize")}
          icon={<CaseSensitive className="shrink-0 size-4 text-default-500" />}
          settingName="titleFontSize"
          settingValue={titleFontSize}
          max={3.0}
          min={1.0}
          step={0.2}
        />
      </ItemWrapper>
      <Button color="danger" variant="flat" onPress={resetSettings}>
        {t("settings.readability.reset")}
      </Button>
    </>
  );
}
