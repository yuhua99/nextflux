import { Controls, MediaPlayer, MediaProvider } from "@vidstack/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { audioState, resetAudio } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import * as Buttons from "./shared/buttons";
import { Button, Card, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils.js";
import { Time } from "./shared/sliders.jsx";
import { Square } from "lucide-react";

export default function AudioPlayer({
  audioTitle,
  artist,
  source,
  artworkUrl,
}) {
  const location = useLocation();
  const [time, setTime] = useState(0);
  const { paused } = useStore(audioState);
  const [expand, setExpand] = useState(false);
  useEffect(() => {
    const hash = location.hash;
    const timeMatch = hash.match(/#t=(\d+):(\d+)/);

    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      const totalSeconds = minutes * 60 + seconds;

      if (!isNaN(totalSeconds)) {
        setTime(totalSeconds);
      }
    }
  }, [location.hash]);
  const url = source.url;
  return (
    <motion.div
      layout
      className={cn("mb-2 px-3", expand && "w-full max-w-96")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <MediaPlayer
        className="rounded-lg shadow-custom w-full bg-background/90 backdrop-blur-lg"
        paused={paused}
        autoPlay={true}
        onPlay={() => audioState.setKey("paused", false)}
        onPause={() => audioState.setKey("paused", true)}
        src={url}
        viewType="audio"
        currentTime={time}
        title={audioTitle}
        artist={artist}
        artwork={[
          {
            src: artworkUrl,
          },
        ]}
      >
        <MediaProvider />
        <Controls.Root className="w-full">
          <div className="flex-1 w-full" />
          <Controls.Group
            className={cn(
              "flex w-full items-center gap-2",
              expand ? "flex-col p-4" : "p-1",
            )}
          >
            <Card
              className={cn(
                "w-10 aspect-square bg-content2",
                expand ? "w-full rounded-medium" : "rounded",
              )}
              isPressable
              shadow={expand ? "lg" : "sm"}
              onPress={() => setExpand(!expand)}
            >
              <Image
                removeWrapper
                radius="none"
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={artworkUrl || ""}
              />
            </Card>
            {expand && (
              <Button
                color="danger"
                radius="full"
                size="sm"
                startContent={<Square className="size-3 fill-current" />}
                variant="flat"
                onPress={() => {
                  resetAudio();
                }}
              >
                停止播放
              </Button>
            )}
            {expand && (
              <div>
                <div className="font-semibold text-sm line-clamp-1">
                  {audioTitle}
                </div>
                <div className="text-default-500 text-sm line-clamp-1">
                  {artist}
                </div>
              </div>
            )}
            {expand && <Time />}
            <div className={cn("button-group", expand && "flex gap-2")}>
              <Buttons.SeekBackward />
              <Buttons.Play />
              <Buttons.SeekForward />
            </div>
          </Controls.Group>
        </Controls.Root>
      </MediaPlayer>
    </motion.div>
  );
}
