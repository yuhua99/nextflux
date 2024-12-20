import { PlayButton, SeekButton, useMediaState } from "@vidstack/react";
import { PauseIcon, PlayIcon, RedoDot, UndoDot } from "lucide-react";
import { Button } from "@nextui-org/react";

export function Play({ variant, size }) {
  const isPaused = useMediaState("paused");
  return (
    <PlayButton asChild>
      <Button
        isIconOnly
        variant={variant}
        size={size}
        radius="full"
        className="text-default-500"
      >
        {isPaused ? (
          <PlayIcon className="size-4 fill-current" />
        ) : (
          <PauseIcon className="size-4 fill-current" />
        )}
      </Button>
    </PlayButton>
  );
}

export function SeekBackward({ variant, size }) {
  return (
    <SeekButton seconds={-15} asChild>
      <Button
        isIconOnly
        variant={variant}
        size={size}
        radius="full"
        className="text-default-500"
      >
        <UndoDot className="size-4" />
      </Button>
    </SeekButton>
  );
}

export function SeekForward({ variant, size }) {
  return (
    <SeekButton seconds={30} asChild>
      <Button
        isIconOnly
        variant={variant}
        size={size}
        radius="full"
        className="text-default-500"
      >
        <RedoDot className="size-4" />
      </Button>
    </SeekButton>
  );
}
