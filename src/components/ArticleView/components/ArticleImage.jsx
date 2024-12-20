import { PhotoView } from "react-photo-view";
import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { getReferrerPolicy } from "@/lib/utils";
import { Image } from "@nextui-org/react";

export default function ArticleImage({ imgNode }) {
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const { src, alt = "" } = imgNode.attribs;

  const referrerPolicy = getReferrerPolicy(src);

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
      <div className="!max-w-[calc(100%+40px)] -mx-5 h-full min-h-[200px] bg-content2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-default-500">
          <ImageOff className="size-5" />
          <span className="text-sm">图片加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <PhotoView key={src} src={src}>
      <Image
        ref={imgRef}
        classNames={{
          wrapper: "!max-w-[calc(100%+40px)] -mx-5 flex justify-center",
          img: "h-auto object-cover m-0",
        }}
        radius="none"
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy={referrerPolicy}
        onError={() => setError(true)}
        onClick={handleImageClick}
      />
    </PhotoView>
  );
}
