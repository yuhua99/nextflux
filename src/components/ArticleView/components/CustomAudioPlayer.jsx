import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CustomAudioPlayer({
  audioTitle,
  artist,
  source,
  artworkUrl,
}) {
  const location = useLocation();
  const [time, setTime] = useState(0);

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
    <div className="mb-4">
      <MediaPlayer
        className="rounded-lg shadow-medium"
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
        <PlyrLayout
          controls={["play", "progress", "current-time", "duration"]}
          icons={plyrLayoutIcons}
          translations={{
            Pause: "暂停",
            Play: "播放",
          }}
        />
      </MediaPlayer>
    </div>
  );
}
