import { usePlaybackRateOptions } from "@vidstack/react"; // See "Icons" component page for setup before importing the following:
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"; // Re-use styles across other submenus.
import { audioState } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import { CircleGauge } from "lucide-react";

export default function SpeedMenu() {
  const { playbackRate } = useStore(audioState);
  const options = usePlaybackRateOptions();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-primary font-semibold"
        >
          {playbackRate === "1" ? (
            <CircleGauge className="size-4 text-default-500" />
          ) : (
            playbackRate
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={new Set([playbackRate.toString()])}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(values) =>
          audioState.setKey("playbackRate", values.currentKey)
        }
      >
        {options.map((option) => (
          <DropdownItem key={option.value}>
            {option.value + " 倍速"}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
