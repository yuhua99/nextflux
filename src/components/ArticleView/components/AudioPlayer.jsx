import { Controls, MediaPlayer, MediaProvider } from "@vidstack/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { audioState } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import * as Buttons from "./shared/buttons";
import { Card, Image } from "@nextui-org/react";

export default function AudioPlayer({
  audioTitle,
  artist,
  source,
  artworkUrl,
}) {
  const location = useLocation();
  const [time, setTime] = useState(0);
  const { paused } = useStore(audioState);

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
    <div className="mb-2 px-3">
      <MediaPlayer
        className="rounded-lg shadow-custom w-full bg-background/80 backdrop-blur-lg"
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
        <Controls.Root>
          <div className="flex-1" />
          <Controls.Group className="flex w-full items-center p-2 gap-2">
            <Card radius="sm" className="w-10 aspect-square bg-content2">
              <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={artworkUrl || ""}
              />
            </Card>
            <Buttons.SeekBackward />
            <Buttons.Play />
            <Buttons.SeekForward />
          </Controls.Group>
        </Controls.Root>
      </MediaPlayer>
    </div>
  );
}
