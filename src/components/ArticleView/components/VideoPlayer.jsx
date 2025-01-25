import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ExternalLink, VideoOff } from "lucide-react";
import { useState } from "react";
// 处理 YouTube URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer({ videoTitle, src, provider }) {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const videoId = getYouTubeId(src);
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice =
    /iphone|ipod|ipad|macintosh/.test(userAgent) && "ontouchend" in document;
  const videoSrc =
    provider === "youtube" ? `https://www.youtube.com/embed/${videoId}` : src;
  if (error) {
    return (
      <div className="w-full mb-4 aspect-video bg-content3 rounded-lg flex items-center justify-center shadow-custom">
        <div className="flex flex-col items-center gap-2 text-default-500">
          <VideoOff className="size-5" />
          <span className="text-sm">{t("articleView.videoError")}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4">
        <MediaPlayer
          className="rounded-lg shadow-custom overflow-hidden bg-black"
          src={videoSrc}
          title={videoTitle}
          preload="none"
          onError={() => setError(true)}
      >
        <MediaProvider>
          <Poster className="vds-poster" />
        </MediaProvider>
        <PlyrLayout
          icons={plyrLayoutIcons}
          translations={t("player")}
          controls={[
            "play-large",
            ...(isIOSDevice
              ? []
              : ["play", "progress", "current-time", "duration", "fullscreen"]),
          ]}
          />
        </MediaPlayer>

      <div className="flex justify-center">
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          classNames={{ base: "cursor-pointer my-2" }}
          endContent={<ExternalLink className="size-4 text-primary pr-1" />}
        >
          <a
            href={
              provider === "youtube"
                ? `https://www.youtube.com/watch?v=${videoId}`
                : src
            }
            className="!border-none"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("common.openInNewWindow")}
          </a>
          </Chip>
        </div>
    </div>
  );
}
