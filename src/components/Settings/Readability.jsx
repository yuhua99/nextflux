import { settingsState } from "@/stores/settingsStore";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignStartVertical,
  CaseSensitive,
  ListOrdered,
  PanelTopDashed,
  SquareCode,
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
import SettingIcon from "@/components/ui/SettingIcon";

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
    showLineNumbers,
    forceDarkCodeTheme,
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
      <ItemWrapper title={t("settings.readability.articleTitle")}>
        <GroupItem
          label={t("settings.readability.titleAlign")}
          icon={
            <SettingIcon variant="green">
              <AlignStartVertical />
            </SettingIcon>
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
          icon={
            <SettingIcon variant="purple">
              <CaseSensitive />
            </SettingIcon>
          }
          settingName="titleFontSize"
          settingValue={titleFontSize}
          max={3.0}
          min={1.0}
          step={0.2}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.readability.text")}>
        <SwitchItem
          label={t("settings.readability.autoHideToolbar")}
          icon={
            <SettingIcon variant="amber">
              <PanelTopDashed />
            </SettingIcon>
          }
          settingName="autoHideToolbar"
          settingValue={autoHideToolbar}
        />
        <Divider />
        <SelItem
          label={t("settings.readability.font")}
          icon={
            <SettingIcon variant="blue">
              <Type />
            </SettingIcon>
          }
          settingName="fontFamily"
          settingValue={fontFamily}
          options={fontOptions}
        />
        <Divider />
        <SwitchItem
          label={t("settings.readability.textAlignJustify")}
          icon={
            <SettingIcon variant="green">
              <AlignJustify />
            </SettingIcon>
          }
          settingName="alignJustify"
          settingValue={alignJustify}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.lineHeight")}
          icon={
            <SettingIcon variant="purple">
              <UnfoldVertical />
            </SettingIcon>
          }
          settingName="lineHeight"
          settingValue={lineHeight}
          max={2.5}
          min={1.2}
          step={0.1}
        />
        <Divider />
        <SliderItem
          label={t("settings.readability.fontSize")}
          icon={
            <SettingIcon variant="purple">
              <CaseSensitive />
            </SettingIcon>
          }
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
            <SettingIcon variant="purple">
              <UnfoldHorizontal />
            </SettingIcon>
          }
          settingName="maxWidth"
          settingValue={maxWidth}
          max={80}
          min={50}
          step={5}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.codeBlock")}>
        <SwitchItem
          label={t("settings.appearance.showLineNumbers")}
          icon={
            <SettingIcon variant="default">
              <ListOrdered />
            </SettingIcon>
          }
          settingName="showLineNumbers"
          settingValue={showLineNumbers}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.forceDarkCodeTheme")}
          icon={
            <SettingIcon variant="default">
              <SquareCode />
            </SettingIcon>
          }
          settingName="forceDarkCodeTheme"
          settingValue={forceDarkCodeTheme}
        />
      </ItemWrapper>
      <Button color="danger" variant="flat" onPress={resetSettings}>
        {t("settings.readability.reset")}
      </Button>
    </>
  );
}
