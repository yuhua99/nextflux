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
import cover from "@/assets/cover.jpg";
import SpeedSubmenu from "@/components/ArticleView/components/shared/speed.jsx";

export default function AudioPlayer({ source }) {
  const location = useLocation();
  const [time, setTime] = useState(0);
  const [expand, setExpand] = useState(false);
  const { title, artist, artwork, playbackRate, paused } = useStore(audioState);
  useEffect(() => {
    const hash = location.hash;
    const timeMatch = hash.match(/#t=(?:(\d+):)?(\d+):(\d+)/);

    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch;
      const totalSeconds =
        (parseInt(hours) || 0) * 3600 +
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
      className="mb-2 px-2 max-w-80 w-full"
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
        className="shadow-custom w-full bg-content1/80 backdrop-blur-lg dark:bg-content2/80 rounded-xl"
        paused={paused}
        autoPlay={true}
        onPlay={() => {
          audioState.setKey("loading", false);
          audioState.setKey("paused", false);
        }}
        onPause={() => audioState.setKey("paused", true)}
        onWaiting={() => audioState.setKey("loading", true)}
        onPlaying={() => audioState.setKey("loading", false)}
        src={url}
        viewType="audio"
        currentTime={time}
        playbackRate={playbackRate}
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
          <Controls.Group
            className={cn(
              "flex w-full items-center gap-2",
              expand ? "flex-col p-6" : "p-2",
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
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-2 w-full"
              >
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
                <div className="w-full text-center">
                  <div className="font-semibold text-sm line-clamp-1">
                    {title}
                  </div>
                  <div className="text-default-500 text-sm line-clamp-1">
                    {artist}
                  </div>
                </div>
                <Time />
                <div className="button-group flex items-center w-full justify-between mb-2">
                  <SpeedSubmenu />
                  <Buttons.SeekBackward variant="light" size="sm" />
                  <Buttons.Play variant="flat" />
                  <Buttons.SeekForward variant="light" size="sm" />
                  <Buttons.Jump variant="light" size="sm" />
                </div>
              </motion.div>
            )}
            {!expand && (
              <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{
                  delay: 0.1,
                }}
                className="flex items-center gap-1 w-full"
              >
                <div className="w-full text-left">
                  <div className="font-semibold text-sm line-clamp-1">
                    {title}
                  </div>
                  <div className="text-default-500 text-sm line-clamp-1">
                    {artist}
                  </div>
                </div>
                <Buttons.Play variant="light" size="sm" />
                <Buttons.SeekForward variant="light" size="sm" />
              </motion.div>
            )}
          </Controls.Group>
        </Controls.Root>
      </MediaPlayer>
    </motion.div>
  );
}
