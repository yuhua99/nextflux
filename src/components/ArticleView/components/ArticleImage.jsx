import { PhotoView } from "react-photo-view";
import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { Image } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils.js";
import { memo } from "react";

function ArticleImage({ imgNode, type = "article" }) {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const { src, alt = "" } = imgNode.attribs;

  const handleImageClick = (e) => {
    e.preventDefault();

    if (imgRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrollContainer = imgRef.current.closest(".article-scroll-area");

      if (scrollContainer) {
        const actionButtons = document.querySelector(".action-buttons");
        if (actionButtons) {
          const actionButtonsRect = actionButtons.getBoundingClientRect();
          const actionButtonsHeight = actionButtonsRect.bottom;

          if (
            imgRect.top < actionButtonsHeight ||
            imgRect.bottom > viewportHeight
          ) {
            const scrollTop =
              scrollContainer.scrollTop +
              imgRect.top -
              (actionButtonsHeight + 10);

            scrollContainer.scrollTo({
              top: scrollTop,
              behavior: "smooth",
            });
          }
        }
      }
    }
  };

  if (error) {
    return (
      <div
        className={cn(
          "h-full min-h-[200px] bg-content2 flex items-center justify-center",
          type === "article" ? "!max-w-[calc(100%+2.5rem)] -mx-5" : "",
        )}
      >
        <div className="flex flex-col items-center gap-2 text-default-500">
          <ImageOff className="size-5" />
          <span className="text-sm">{t("articleView.imageError")}</span>
        </div>
      </div>
    );
  }

  return (
    <PhotoView key={src} src={src}>
      <Image
        ref={imgRef}
        disableAnimation
        classNames={{
          wrapper: cn(
            " flex justify-center my-1",
            type === "article" ? "!max-w-[calc(100%+2.5rem)] -mx-5" : "",
            type === "enclosure"
              ? "rounded-lg !shadow-custom mx-auto overflow-hidden"
              : "",
          ),
          img: "h-auto object-cover m-0",
        }}
        radius="none"
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        onClick={handleImageClick}
      />
    </PhotoView>
  );
}

const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.imgNode.attribs.src === nextProps.imgNode.attribs.src &&
    prevProps.type === nextProps.type
  );
};

export default memo(ArticleImage, arePropsEqual);
