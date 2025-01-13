import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Chip } from "@nextui-org/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// 处理 YouTube URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer({ videoTitle, src, provider }) {
  const { t } = useTranslation();
  const videoId = getYouTubeId(src);
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice =
    /iphone|ipod|ipad|macintosh/.test(userAgent) && "ontouchend" in document;
  const videoSrc =
    provider === "youtube" ? `https://www.youtube.com/embed/${videoId}` : src;
  return (
    <div className="mb-4">
      <MediaPlayer
        className="rounded-lg shadow-custom overflow-hidden bg-black"
        src={videoSrc}
        title={videoTitle}
        preload="none"
        onError={(detail) => toast.error(detail.message)}
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
          onClick={() => {
            window.open(
              provider === "youtube"
                ? `https://www.youtube.com/watch?v=${videoId}`
                : src,
              "_blank",
            );
          }}
        >
          {t("common.openInNewWindow")}
        </Chip>
      </div>
    </div>
  );
}
