import { Chip } from "@heroui/react";
import ArticleImage from "./ArticleImage";
import VideoPlayer from "./VideoPlayer";
import { useTranslation } from "react-i18next";

export default function Attachments({ article }) {
  const { t } = useTranslation();

  // 检查是否有图片附件
  const imgEnclosures = article?.enclosures?.filter((enclosure) =>
    enclosure.mime_type?.startsWith("image/"),
  );
  // 检查是否有视频附件
  const videoEnclosures = article?.enclosures?.filter((enclosure) =>
    enclosure.mime_type?.startsWith("video/"),
  );

  // 定义黑名单域名列表
  const blacklist = ["youtube.com", "youtu.be", "reddit.com", "glass.photo"];

  // 检查文章的URL是否在黑名单中
  const isBlacklisted = blacklist.some((domain) =>
    article?.feed?.url?.includes(domain),
  );

  if (isBlacklisted || !article?.enclosures) {
    return null;
  }

  if (imgEnclosures?.length === 0 && videoEnclosures?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl shadow-medium bg-content2 p-5 mt-2">
      <div>
        <Chip color="primary" variant="flat" size="sm">
          {t("articleView.attachments")}
        </Chip>
      </div>
      {imgEnclosures.map((enclosure) => (
        <ArticleImage
          key={enclosure.url}
          type="enclosure"
          imgNode={{
            attribs: {
              src: enclosure.url,
              alt: enclosure.title,
            },
          }}
        />
      ))}
      {videoEnclosures.map((enclosure) => (
        <VideoPlayer
          key={enclosure.url}
          videoTitle={article?.title}
          src={enclosure.url}
          provider="video"
        />
      ))}
    </div>
  );
}
