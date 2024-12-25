import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Button, Chip, Image } from "@nextui-org/react";
import { useState } from "react";
import { extractFirstImage } from "@/lib/utils.js";
import { activeArticle } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Play } from "lucide-react";

const CHINESE = {
  "Current time": "当前时间",
  "Disable captions": "禁用字幕",
  "Enable captions": "启用字幕",
  "Enter Fullscreen": "进入全屏",
  "Enter PiP": "进入画中画",
  "Exit Fullscreen": "退出全屏",
  "Exit PiP": "退出画中画",
  "Go back to previous menu": "返回上一菜单",
  Ad: "广告",
  AirPlay: "AirPlay",
  All: "全部",
  Audio: "音频",
  Auto: "自动",
  Buffered: "缓冲",
  Captions: "字幕",
  Default: "默认",
  Disabled: "禁用",
  Download: "下载",
  Duration: "持续时间",
  Enabled: "启用",
  End: "结束",
  Forward: "前进",
  LIVE: "直播",
  Loop: "循环",
  Mute: "静音",
  Normal: "正常",
  Pause: "暂停",
  Play: "播放",
  Played: "已播放",
  Quality: "质量",
  Reset: "重置",
  Restart: "重新开始",
  Rewind: "倒退",
  Seek: "搜索",
  Settings: "设置",
  Speed: "速度",
  Start: "开始",
  Unmute: "取消静音",
  Volume: "音量",
};

// 处理 YouTube URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer({ src, provider }) {
  const videoId = getYouTubeId(src);
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice =
    /iphone|ipod|ipad|macintosh/.test(userAgent) && "ontouchend" in document;
  const videoSrc =
    provider === "youtube" ? `https://www.youtube.com/embed/${videoId}` : src;

  const [clicked, setClicked] = useState(false);
  const $activeArticle = useStore(activeArticle);
  return (
    <div className="mb-4">
      {clicked ? (
        <MediaPlayer
          className="rounded-lg shadow-custom overflow-hidden"
          src={videoSrc}
          crossOrigin
          autoPlay={true}
          posterLoad="visible"
        >
          <MediaProvider />
          <PlyrLayout
            icons={plyrLayoutIcons}
            translations={CHINESE}
            controls={[
              ...(isIOSDevice
                ? ["play-large"]
                : [
                    "play",
                    "progress",
                    "current-time",
                    "duration",
                    "fullscreen",
                  ]),
            ]}
          />
        </MediaPlayer>
      ) : (
        <div className="video-card relative mx-auto w-full aspect-video bg-content2 rounded-lg shadow-custom overflow-hidden">
          <Image
            removeWrapper
            radius="none"
            alt="Card background"
            classNames={{ img: "m-0 absolute z-0 w-full h-full object-cover" }}
            src={extractFirstImage($activeArticle)}
          />
          <div className="button-wrapper absolute z-10 top-0 w-full h-full flex flex-col items-center justify-center">
            <Button
              className="bg-white text-black/60 shadow-custom"
              radius="full"
              isIconOnly
              onPress={() => setClicked(true)}
            >
              <Play className="size-4 fill-current" />
            </Button>
          </div>
        </div>
      )}
      {provider === "youtube" && (
        <div className="flex justify-center">
          <Chip
            color="primary"
            variant="flat"
            size="sm"
            classNames={{ base: "cursor-pointer my-2" }}
            onClick={() => {
              window.open(
                `https://www.youtube.com/watch?v=${videoId}`,
                "_blank",
              );
            }}
          >
            在新窗口中打开嵌入内容
          </Chip>
        </div>
      )}
    </div>
  );
}
