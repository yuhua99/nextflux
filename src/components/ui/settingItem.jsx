import { updateSettings } from "@/stores/settingsStore.js";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Slider,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";

import { ChevronsUpDown } from "lucide-react";

const bgColor = "bg-content1 dark:bg-content2/30";

export const ItemWrapper = ({ title, children }) => {
  return (
    <div className="settings-group">
      <div className="text-xs text-content2-foreground ml-2 mb-1">{title}</div>
      <div className="rounded-lg overflow-hidden border">{children}</div>
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
          onChange={(value) => updateSettings({ [settingName]: value[0] })}
          maxValue={max}
          minValue={min}
          step={step}
        />
        <Chip
          size="sm"
          variant="flat"
          color="primary"
          classNames={{
            content: "w-12 justify-center text-center",
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
      className={`flex justify-between items-center gap-2 ${bgColor} px-2 py-2.5`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Switch
        isSelected={settingValue}
        isDisabled={disabled}
        onValueChange={(value) => updateSettings({ [settingName]: value })}
      />
    </div>
  );
};

export function SelItem({ label, icon, settingName, settingValue, options }) {
  return (
    <div className={`flex justify-between items-center gap-2 ${bgColor} p-2`}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="capitalize"
            variant="flat"
            size="sm"
            endContent={<ChevronsUpDown className="size-4" />}
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
    <div className={`flex justify-between items-center gap-2 ${bgColor} p-2`}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm text-foreground">{label}</div>
      </div>
      <Tabs
        aria-label={settingName}
        size="sm"
        variant="solid"
        classNames={{
          tabList: "bg-default-100/90 backdrop-blur-md",
          tab: "py-0 h-6",
          cursor: "bg-content1",
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
