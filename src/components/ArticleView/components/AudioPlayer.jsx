import { Controls, MediaPlayer, MediaProvider } from "@vidstack/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { activeAudio, audioState, resetAudio } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import * as Buttons from "./shared/buttons";
import { Button, Card, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils.js";
import { Time } from "./shared/sliders.jsx";
import { Square } from "lucide-react";
import cover from "@/assets/cover.jpg";

export default function AudioPlayer({ source }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const { paused } = useStore(audioState);
  const [expand, setExpand] = useState(false);
  const $activeAudio = useStore(activeAudio);
  const { title, artist, artwork } = useStore(audioState);
  useEffect(() => {
    const hash = location.hash;
    const timeMatch = hash.match(/#t=(?:(\d+):)?(\d+):(\d+)/);

    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch;
      const totalSeconds = (parseInt(hours) || 0) * 3600 + 
                          parseInt(minutes) * 60 + 
                          parseInt(seconds);

      if (!isNaN(totalSeconds)) {
        setTime(totalSeconds);
      }
    }
  }, [location.hash]);
  const url = source.url;
  return (
    <motion.div
      layout
      className={cn("mb-2 px-2", expand ? "w-full max-w-96" : "")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0.2,
        ease: "linear",
      }}
    >
      <MediaPlayer
        className="shadow-custom w-full bg-background/80 backdrop-blur-lg dark:bg-content2/80 rounded-xl"
        paused={paused}
        autoPlay={true}
        onPlay={() => audioState.setKey("paused", false)}
        onPause={() => audioState.setKey("paused", true)}
        src={url}
        viewType="audio"
        currentTime={time}
        title={title}
        artist={artist}
        artwork={[
          {
            src: artwork || cover,
          },
        ]}
      >
        <MediaProvider />
        <Controls.Root className="w-full">
          <div className="flex-1 w-full" />
          <Controls.Group
            className={cn(
              "flex w-full items-center gap-2",
              expand ? "flex-col p-8" : "p-2",
            )}
          >
            <motion.div
              layout
              transition={{
                duration: 0.4,
                type: "spring",
                bounce: 0.2,
                ease: "linear",
              }}
              className={expand ? "w-full" : ""}
            >
              <Card
                className={cn(
                  "w-10 aspect-square bg-content2 rounded-lg shadow-custom",
                  expand ? "w-full rounded-lg" : "rounded",
                )}
                isPressable
                onPress={() => setExpand(!expand)}
              >
                <Image
                  removeWrapper
                  radius="none"
                  alt="Card background"
                  className="z-0 w-full h-full object-cover"
                  src={artwork || cover}
                />
              </Card>
            </motion.div>
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
              <div
                className="w-full text-center cursor-pointer"
                onClick={() => navigate(`/article/${$activeAudio?.entry_id}`)}
              >
                <div className="font-semibold text-sm line-clamp-1">
                  {title}
                </div>
                <div className="text-default-500 text-sm line-clamp-1">
                  {artist}
                </div>
              </div>
            )}
            {expand && <Time />}
            <motion.div
              layout
              transition={{
                duration: 0.4,
                type: "spring",
                bounce: 0.2,
                ease: "linear",
              }}
              className={cn(
                "button-group flex items-center",
                expand ? "gap-8 " : "gap-1",
              )}
            >
              <Buttons.SeekBackward variant="light" size="sm" />
              <Buttons.Play variant="light" size="sm" />
              <Buttons.SeekForward variant="light" size="sm" />
            </motion.div>
          </Controls.Group>
        </Controls.Root>
      </MediaPlayer>
    </motion.div>
  );
}
