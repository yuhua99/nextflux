import { useTranslation } from "react-i18next";
import { ItemWrapper } from "@/components/ui/settingItem.jsx";
import { ChevronsUpDown, Earth } from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

const languages = [
  { id: "zh-CN", name: "简体中文" },
  { id: "en-US", name: "English" },
];

export default function Language() {
  const { i18n, t } = useTranslation();

  return (
    <ItemWrapper title={t("settings.general.language")}>
      <div className="flex justify-between items-center gap-2 bg-content1 dark:bg-content2/30 p-2">
        <div className="flex items-center gap-2">
          <Earth className="shrink-0 size-4 text-default-500" />
          <div className="text-sm text-foreground line-clamp-1">
            {t("settings.general.interfaceLanguage")}
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="flat"
              size="sm"
              endContent={<ChevronsUpDown className="size-4 shrink-0" />}
            >
              {languages.find((lang) => lang.id === i18n.language)?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="language"
            selectedKeys={new Set([i18n.language])}
            selectionMode="single"
            onSelectionChange={(keys) => {
              i18n.changeLanguage(keys.currentKey);
            }}
          >
            {languages.map((lang) => (
              <DropdownItem key={lang.id}>{lang.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </ItemWrapper>
  );
}
