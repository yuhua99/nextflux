import { updateSettings } from "@/stores/settingsStore.js";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Kbd,
  Slider,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";

import { ChevronsUpDown } from "lucide-react";

const bgColor = "bg-content1 dark:bg-content2/30";

export const ItemWrapper = ({ title, children }) => {
  return (
    <div className="settings-group">
      <div className="text-xs text-default-400 font-medium ml-2 mb-1">
        {title}
      </div>
      <div className="rounded-xl overflow-hidden border shadow-sm">
        {children}
      </div>
    </div>
  );
};

export const SliderItem = ({
  label,
  icon,
  settingName,
  settingValue,
  max,
  min,
  step,
}) => {
  return (
    <div className={`grid gap-2 ${bgColor} p-2`}>
      <div className="text-xs text-content2-foreground">{label}</div>
      <div className="flex items-center gap-2">
        {icon}
        <Slider
          aria-label={label}
          value={[settingValue]}
          size="sm"
          onChange={(value) => updateSettings({ [settingName]: value[0] })}
          maxValue={max}
          minValue={min}
          step={step}
          renderThumb={(props) => (
            <div
              {...props}
              className="group h-6 w-6 top-1/2 bg-white border border-[rgba(0,0,0,0.06)] shadow-custom-sm rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
            ></div>
          )}
        />
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: "shadow-custom-inner",
            content: "w-10 justify-center text-center",
          }}
        >
          {settingValue}
        </Chip>
      </div>
    </div>
  );
};

export const SwitchItem = ({
  label,
  icon,
  settingName,
  settingValue,
  disabled = false,
}) => {
  return (
    <div
      className={`flex justify-between items-center gap-2 ${bgColor} px-2 py-3`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground line-clamp-1">{label}</div>
      </div>
      <Switch
        isSelected={settingValue}
        classNames={{
          wrapper: "shadow-custom-inner h-6 w-11 px-0.5 overflow-visible",
          thumb: "absolute w-5 h-5 shadow-md",
        }}
        isDisabled={disabled}
        onValueChange={(value) => updateSettings({ [settingName]: value })}
      />
    </div>
  );
};

export function SelItem({ label, icon, settingName, settingValue, options }) {
  return (
    <div
      className={`flex justify-between items-center gap-2 ${bgColor} px-2 py-2.5`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground line-clamp-1">{label}</div>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="capitalize gap-1 pr-1.5 h-7 rounded-md bg-content1 dark:bg-default !shadow-custom-cursor"
            variant="solid"
            size="sm"
            endContent={<ChevronsUpDown className="size-4 shrink-0" />}
          >
            {options.find((opt) => opt.value === settingValue.toString())
              ?.label || settingValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Single selection example"
          selectedKeys={new Set([settingValue])}
          selectionMode="single"
          variant="flat"
          onSelectionChange={(values) =>
            updateSettings({ [settingName]: values.currentKey })
          }
        >
          {options.map((option) => (
            <DropdownItem key={option.value} style={option.style}>
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export function GroupItem({ label, icon, settingName, settingValue, options }) {
  return (
    <div
      className={`flex justify-between items-center gap-2 ${bgColor} px-2 h-12`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Tabs
        aria-label={settingName}
        size="sm"
        variant="solid"
        classNames={{
          tabList:
            "bg-default-100/90 backdrop-blur-md shadow-custom-inner p-[1px] gap-0 rounded-small overflow-visible",
          tab: "py-1 h-7",
          cursor: "bg-content1 !shadow-custom-cursor rounded-small",
        }}
        selectedKey={settingValue}
        onSelectionChange={(value) => {
          updateSettings({ [settingName]: value });
        }}
      >
        {options.map((option) => (
          <Tab
            key={option.value}
            title={
              <div className="flex items-center space-x-2">
                {option.icon}
                {option.label && <span>{option.label}</span>}
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}

export function KeyboardItem({ desc, kbdKey, keyStr }) {
  return (
    <div
      className={`flex justify-between items-center gap-2 ${bgColor} px-2 py-3`}
    >
      <div className="flex items-center gap-2">
        <div className="text-sm text-foreground">{desc}</div>
      </div>
      <Kbd
        classNames={{
          base: "min-w-8",
          abbr: "font-mono text-xs text-default-400",
          content: "w-full font-mono text-xs text-default-400",
        }}
        keys={kbdKey}
      >
        {keyStr}
      </Kbd>
    </div>
  );
}
