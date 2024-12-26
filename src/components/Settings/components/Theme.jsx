import {
  ChevronsUpDown,
  Monitor,
  MoonStar,
  Paintbrush,
  Sun,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import { ItemWrapper } from "@/components/ui/settingItem";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { setTheme, themes, themeState } from "@/stores/themeStore";

export default function Theme() {
  const { themeMode, lightTheme, darkTheme } = useStore(themeState);

  const mode = [
    {
      id: "system",
      name: "跟随系统",
      icon: <Monitor className="shrink-0 size-4 text-default-500" />,
    },
    {
      id: "light",
      name: "浅色",
      icon: <Sun className="shrink-0 size-4 text-default-500" />,
    },
    {
      id: "dark",
      name: "深色",
      icon: <MoonStar className="shrink-0 size-4 text-default-500" />,
    },
  ];

  const bgColor = "dark:bg-content1 bg-background";

  return (
    <ItemWrapper title="主题">
      <div className={`flex justify-between items-center gap-2 ${bgColor} p-2`}>
        <div className="flex items-center gap-2">
          <Paintbrush className="shrink-0 size-4 text-default-500" />
          <div className="text-sm text-foreground">模式</div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="flat"
              size="sm"
              endContent={<ChevronsUpDown className="size-4" />}
            >
              {mode.find((item) => item.id === themeMode)?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="theme"
            selectedKeys={new Set([themeMode])}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(values) => setTheme(values.currentKey)}
          >
            {mode.map((item) => (
              <DropdownItem key={item.id} startContent={item.icon}>
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <Divider />
      <div className={`flex justify-between items-center gap-2 ${bgColor} p-2`}>
        <div className="flex items-center gap-2">
          <Sun className="shrink-0 size-4 text-default-500" />
          <div className="text-sm text-foreground">浅色主题</div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="flat"
              size="sm"
              endContent={<ChevronsUpDown className="size-4" />}
            >
              {themes.light.find((item) => item.id === lightTheme)?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="theme"
            selectedKeys={new Set([lightTheme])}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(values) => {
              themeState.set({
                ...themeState.get(),
                lightTheme: values.currentKey,
              });
              themeMode !== "dark" && setTheme(themeMode, values.currentKey);
            }}
          >
            {themes.light.map((item) => (
              <DropdownItem
                key={item.id}
                startContent={
                  <div
                    className="size-4 border rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                }
              >
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <Divider />
      <div className={`flex justify-between items-center gap-2 ${bgColor} p-2`}>
        <div className="flex items-center gap-2">
          <MoonStar className="shrink-0 size-4 text-default-500" />
          <div className="text-sm text-foreground">深色主题</div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="flat"
              size="sm"
              endContent={<ChevronsUpDown className="size-4" />}
            >
              {themes.dark.find((item) => item.id === darkTheme)?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="theme"
            selectedKeys={new Set([darkTheme])}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(values) => {
              themeState.set({
                ...themeState.get(),
                darkTheme: values.currentKey,
              });
              themeMode !== "light" && setTheme(themeMode, values.currentKey);
            }}
          >
            {themes.dark.map((item) => (
              <DropdownItem
                key={item.id}
                startContent={
                  <div
                    className="size-4 border rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                }
              >
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </ItemWrapper>
  );
}
