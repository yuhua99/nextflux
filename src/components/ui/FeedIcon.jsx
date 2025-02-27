import { useState, useEffect } from "react";
import { Image } from "@heroui/react";
import { Rss } from "lucide-react";
import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils";
import { getFeedIcon, setFeedIcon } from "@/db/storage";
import minifluxAPI from "@/api/miniflux";

const FeedIcon = ({ feedId }) => {
  const { feedIconShape, useGrayIcon } = useStore(settingsState);
  const [error, setError] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);
  const [iconData, setIconData] = useState(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        let icon = await getFeedIcon(feedId);

        if (!icon || Date.now() - icon.updatedAt > 7 * 24 * 60 * 60 * 1000) {
          const newIcon = await minifluxAPI.getIconByFeedId(feedId);
          if (newIcon) {
            await setFeedIcon({
              feedId,
              mime_type: newIcon.mime_type,
              data: newIcon.data,
            });
            icon = newIcon;
          }
        }

        if (icon) {
          setIconData(`data:${icon.data}`);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("加载订阅源图标失败:", err);
        setError(true);
      }
    };

    if (feedId) {
      loadIcon();
    }
  }, [feedId]);

  // 处理图片加载错误
  const handleError = () => {
    setError(true);
  };

  // 检查图片质量
  const handleLoad = (e) => {
    const img = e.target;
    // 如果图片实际尺寸小于预期尺寸(32x32)，认为图片质量不佳
    if (img.naturalWidth < 32 || img.naturalHeight < 32) {
      setIsBlurry(true);
    }
  };

  // 如果URL无效、图片加载失败或图片模糊，显示默认图标
  if (error || isBlurry) {
    return (
      <span
        className={cn(
          "flex items-center shrink-0 justify-center w-5 h-5 p-0.5 bg-white transition-opacity duration-300 ease-in-out animate-in fade-in-0 shadow-small",
          feedIconShape === "circle" ? "rounded-full" : "rounded",
        )}
      >
        <Rss strokeWidth={3} className="size-3 text-black/60" />
      </span>
    );
  }

  return (
    <Image
      alt="Feed icon"
      src={iconData}
      className="size-5 p-0.5 bg-white shadow-small"
      classNames={{
        wrapper: "shrink-0",
        img: cn(
          useGrayIcon ? "grayscale" : "",
          feedIconShape === "circle" ? "rounded-full" : "rounded",
        ),
      }}
      onError={handleError}
      onLoad={(e) => {
        handleLoad(e);
      }}
    />
  );
};

export default FeedIcon;
