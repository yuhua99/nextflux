import { Controls, MediaPlayer, MediaProvider } from "@vidstack/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { audioState, resetAudio } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import * as Buttons from "./shared/buttons";
import { Button, Card, Image } from "@nextui-org/react";
import { Time } from "./shared/sliders.jsx";
import { Square } from "lucide-react";
import cover from "@/assets/cover.jpg";
import SpeedSubmenu from "@/components/ArticleView/components/shared/speed.jsx";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <MediaPlayer
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
        <Controls.Root className="w-full mb-2 px-2 max-w-xs mx-auto">
          {expand ? (
            <motion.div
              layoutId="wrapper"
              className="flex-1 w-full shadow-custom bg-content1/80 backdrop-blur-lg dark:bg-content2/80"
              style={{
                borderRadius: "12px",
              }}
            >
              <Controls.Group className="flex w-full items-center gap-2 flex-col p-8">
                <>
                  <motion.div layoutId="artwork" className="w-full">
                    <Card
                      className="w-full rounded-lg bg-content2 shadow-custom"
                      isPressable
                      onPress={() => setExpand(false)}
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

                  <motion.div
                    layoutId="stop-button"
                    className="w-full flex justify-center"
                  >
                    <Button
                      color="danger"
                      radius="full"
                      size="sm"
                      startContent={<Square className="size-3 fill-current" />}
                      variant="flat"
                      onPress={resetAudio}
                    >
                      停止播放
                    </Button>
                  </motion.div>

                  <div className="w-full text-center">
                    <motion.div
                      layoutId="music-title-large"
                      className="font-semibold text-sm line-clamp-1"
                    >
                      {title}
                    </motion.div>
                    <motion.div
                      layoutId="music-artist-large"
                      className="text-default-500 text-sm line-clamp-1"
                    >
                      {artist}
                    </motion.div>
                  </div>

                  <motion.div layoutId="time" className="w-full">
                    <Time />
                  </motion.div>

                  <motion.div
                    layoutId="controls-large"
                    className="button-group flex items-center w-full justify-between"
                  >
                    <SpeedSubmenu />
                    <Buttons.SeekBackward variant="light" size="sm" />
                    <Buttons.Play variant="light" size="sm" />
                    <Buttons.SeekForward variant="light" size="sm" />
                    <Buttons.Jump variant="light" size="sm" />
                  </motion.div>
                </>
              </Controls.Group>
            </motion.div>
          ) : (
            <motion.div
              layoutId="wrapper"
              className="flex-1 w-full shadow-custom bg-content1/80 backdrop-blur-lg dark:bg-content2/80"
              style={{
                borderRadius: "12px",
              }}
            >
              <Controls.Group className="flex w-full items-center gap-2 p-2">
                <>
                  <motion.div layoutId="artwork">
                    <Card
                      className="w-10 aspect-square bg-content2 rounded shadow-custom"
                      isPressable
                      onPress={() => setExpand(true)}
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

                  <div className="w-full">
                    <motion.div
                      layoutId="music-title-small"
                      className="font-semibold text-sm line-clamp-1"
                    >
                      {title}
                    </motion.div>
                    <motion.div
                      layoutId="music-artist-small"
                      className="text-default-500 text-sm line-clamp-1"
                    >
                      {artist}
                    </motion.div>
                  </div>

                  <motion.div
                    layoutId="controls-small"
                    className="button-group flex items-center gap-1"
                  >
                    <Buttons.Play variant="light" size="sm" />
                    <Buttons.SeekForward variant="light" size="sm" />
                  </motion.div>
                </>
              </Controls.Group>
            </motion.div>
          )}
        </Controls.Root>
      </MediaPlayer>
    </motion.div>
  );
}
