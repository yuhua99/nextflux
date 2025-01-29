import { settingsState } from "@/stores/settingsStore";
import { Divider } from "@heroui/react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import {
  CandyOff,
  Circle,
  CircleDashed,
  Clock,
  LayoutList,
  ListOrdered,
  MonitorPlay,
  Rss,
  Square,
  SquareCode,
  Text,
} from "lucide-react";
import Theme from "./components/Theme";
import { useTranslation } from "react-i18next";
import SettingIcon from "@/components/ui/SettingIcon";

export default function Appearance() {
  const {
    feedIconShape,
    useGrayIcon,
    cardImageSize,
    showFavicon,
    showTextPreview,
    showReadingTime,
    showLineNumbers,
    forceDarkCodeTheme,
    reduceMotion,
    useNativeVideoPlayer,
  } = useStore(settingsState);
  const { t } = useTranslation();
  return (
    <>
      <Theme />
      <ItemWrapper title={t("settings.appearance.favicons")}>
        <SelItem
          label={t("settings.appearance.shape")}
          icon={
            <SettingIcon variant="blue">
              {feedIconShape === "circle" ? <Circle /> : <Square />}
            </SettingIcon>
          }
          settingName="feedIconShape"
          settingValue={feedIconShape}
          options={[
            { value: "circle", label: t("settings.appearance.circle") },
            { value: "square", label: t("settings.appearance.square") },
          ]}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.grayscale")}
          icon={
            <SettingIcon variant="default">
              <CircleDashed />
            </SettingIcon>
          }
          settingName="useGrayIcon"
          settingValue={useGrayIcon}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.articleList")}>
        <SelItem
          label={t("settings.appearance.imagePreviews")}
          icon={
            <SettingIcon variant="green">
              <LayoutList />
            </SettingIcon>
          }
          settingName="cardImageSize"
          settingValue={cardImageSize}
          options={[
            { value: "none", label: t("settings.appearance.none") },
            { value: "small", label: t("settings.appearance.small") },
            { value: "large", label: t("settings.appearance.large") },
          ]}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.showFavicon")}
          icon={
            <SettingIcon variant="green">
              <Rss />
            </SettingIcon>
          }
          settingName="showFavicon"
          settingValue={showFavicon}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.showTextPreview")}
          icon={
            <SettingIcon variant="green">
              <Text />
            </SettingIcon>
          }
          settingName="showTextPreview"
          settingValue={showTextPreview}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.showReadingTime")}
          icon={
            <SettingIcon variant="green">
              <Clock />
            </SettingIcon>
          }
          settingName="showReadingTime"
          settingValue={showReadingTime}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.videoPlayer")}>
        <SwitchItem
          label={t("settings.appearance.useNativeVideoPlayer")}
          icon={
            <SettingIcon variant="red">
              <MonitorPlay />
            </SettingIcon>
          }
          settingName="useNativeVideoPlayer"
          settingValue={useNativeVideoPlayer}
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
      <ItemWrapper title={t("settings.appearance.motion")}>
        <SwitchItem
          label={t("settings.appearance.reduceMotion")}
          icon={
            <SettingIcon variant="cyan">
              <CandyOff />
            </SettingIcon>
          }
          settingName="reduceMotion"
          settingValue={reduceMotion}
        />
      </ItemWrapper>
    </>
  );
}
