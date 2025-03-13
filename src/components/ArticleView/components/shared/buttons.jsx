import { PlayButton, SeekButton, useMediaState } from "@vidstack/react";
import { FileSymlink, RedoDot, UndoDot } from "lucide-react";
import { Button } from "@heroui/react";
import { activeAudio } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";
import { plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";
import { cn } from "@/lib/utils";

export function Play({ variant, size }) {
  const isPaused = useMediaState("paused");
  const { Play, Pause } = plyrLayoutIcons;
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
          <Play className="size-4 fill-current ml-0.5" />
        ) : (
          <Pause className="size-4 fill-current" />
        )}
      </Button>
    </PlayButton>
  );
}

export function SeekBackward({ variant, size, className = "" }) {
  return (
    <SeekButton seconds={-15} asChild>
      <Button
        isIconOnly
        variant={variant}
        size={size}
        radius="full"
        className={cn("text-default-500", className)}
      >
        <UndoDot className="size-4" />
      </Button>
    </SeekButton>
  );
}

export function SeekForward({ variant, size, className = "" }) {
  return (
    <SeekButton seconds={30} asChild>
      <Button
        isIconOnly
        variant={variant}
        size={size}
        radius="full"
        className={cn("text-default-500", className)}
      >
        <RedoDot className="size-4" />
      </Button>
    </SeekButton>
  );
}

export function Jump({ variant, size }) {
  const $activeAudio = useStore(activeAudio);
  const navigate = useNavigate();
  return (
    <Button
      isIconOnly
      variant={variant}
      size={size}
      radius="full"
      className="text-default-500"
      onPress={() => navigate(`/article/${$activeAudio?.entry_id}`)}
    >
      <FileSymlink className="size-4" />
    </Button>
  );
}
