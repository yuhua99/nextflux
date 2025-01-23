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
            feedIconShape === "circle" ? (
              <Circle className="shrink-0 size-4 text-default-500" />
            ) : (
              <Square className="shrink-0 size-4 text-default-500" />
            )
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
          icon={<CircleDashed className="shrink-0 size-4 text-default-500" />}
          settingName="useGrayIcon"
          settingValue={useGrayIcon}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.articleList")}>
        <SelItem
          label={t("settings.appearance.imagePreviews")}
          icon={<LayoutList className="shrink-0 size-4 text-default-500" />}
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
          icon={<Rss className="shrink-0 size-4 text-default-500" />}
          settingName="showFavicon"
          settingValue={showFavicon}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.showTextPreview")}
          icon={<Text className="shrink-0 size-4 text-default-500" />}
          settingName="showTextPreview"
          settingValue={showTextPreview}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.showReadingTime")}
          icon={<Clock className="shrink-0 size-4 text-default-500" />}
          settingName="showReadingTime"
          settingValue={showReadingTime}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.videoPlayer")}>
        <SwitchItem
          label={t("settings.appearance.useNativeVideoPlayer")}
          icon={<MonitorPlay className="shrink-0 size-4 text-default-500" />}
          settingName="useNativeVideoPlayer"
          settingValue={useNativeVideoPlayer}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.codeBlock")}>
        <SwitchItem
          label={t("settings.appearance.showLineNumbers")}
          icon={<ListOrdered className="shrink-0 size-4 text-default-500" />}
          settingName="showLineNumbers"
          settingValue={showLineNumbers}
        />
        <Divider />
        <SwitchItem
          label={t("settings.appearance.forceDarkCodeTheme")}
          icon={<SquareCode className="shrink-0 size-4 text-default-500" />}
          settingName="forceDarkCodeTheme"
          settingValue={forceDarkCodeTheme}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.appearance.motion")}>
        <SwitchItem
          label={t("settings.appearance.reduceMotion")}
          icon={<CandyOff className="shrink-0 size-4 text-default-500" />}
          settingName="reduceMotion"
          settingValue={reduceMotion}
        />
      </ItemWrapper>
    </>
  );
}
