import { settingsState } from "@/stores/settingsStore";
import {
  CircleCheck,
  CircleDot,
  ClockArrowDown,
  ClockArrowUp,
  Eye,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  ItemWrapper,
  SelItem,
  SwitchItem,
} from "@/components/ui/settingItem.jsx";
import { Divider } from "@nextui-org/react";
import Language from "@/components/Settings/components/Language.jsx";
import { useTranslation } from "react-i18next";

export default function General() {
  const {
    sortDirection,
    showHiddenFeeds,
    markAsReadOnScroll,
    syncInterval,
    defaultExpandCategory,
    showUnreadByDefault,
  } = useStore(settingsState);
  const { t } = useTranslation();
  return (
    <>
      <Language />
      <ItemWrapper title={t("settings.general.sync")}>
        <SelItem
          label={t("settings.general.syncInterval")}
          icon={<RefreshCw className="shrink-0 size-4 text-default-500" />}
          settingName="syncInterval"
          settingValue={syncInterval}
          options={[
            { value: "0", label: t("settings.general.syncOff") },
            { value: "5", label: t("settings.general.sync5min") },
            { value: "15", label: t("settings.general.sync15min") },
            { value: "30", label: t("settings.general.sync30min") },
            { value: "60", label: t("settings.general.sync1hour") },
          ]}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.general.feeds")}>
        <SwitchItem
          label={t("settings.general.showHiddenFeeds")}
          icon={<Eye className="shrink-0 size-4 text-default-500" />}
          settingName="showHiddenFeeds"
          settingValue={showHiddenFeeds}
        />
        <Divider />
        <SwitchItem
          label={t("settings.general.defaultExpandCategory")}
          icon={<FolderOpen className="shrink-0 size-4 text-default-500" />}
          settingName="defaultExpandCategory"
          settingValue={defaultExpandCategory}
        />
      </ItemWrapper>
      <ItemWrapper title={t("settings.general.articleList")}>
        <SelItem
          label={t("settings.general.sortItems")}
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
            { value: "desc", label: t("settings.general.sortDesc") },
            { value: "asc", label: t("settings.general.sortAsc") },
          ]}
        />
        <Divider />
        <SwitchItem
          label={t("settings.general.showUnreadByDefault")}
          icon={<CircleDot className="shrink-0 size-4 text-default-500" />}
          settingName="showUnreadByDefault"
          settingValue={showUnreadByDefault}
        />
        <Divider />
        <SwitchItem
          label={t("settings.general.markAsReadOnScroll")}
          icon={<CircleCheck className="shrink-0 size-4 text-default-500" />}
          settingName="markAsReadOnScroll"
          settingValue={markAsReadOnScroll}
        />
      </ItemWrapper>
    </>
  );
}
