import { useEffect, useRef, useState } from "react";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils.js";
import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";

export default function ArticleCardCover({ imageUrl }) {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);
  const { cardImageSize } = useStore(settingsState);
  useEffect(() => {
    const imgElement = imgRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "10px",
        threshold: 0.1,
      },
    );

    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, []);

  if (!imageUrl || error) {
    return null;
  }

  // if (error) {
  //   return (
  //     <div className="w-full aspect-video bg-content3 rounded-lg flex items-center justify-center shadow-custom">
  //       <div className="flex flex-col items-center gap-2 text-content3-foreground">
  //         <ImageOff className="size-5" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      ref={imgRef}
      className={cn(
        "card-image bg-content3 rounded-lg shadow-custom overflow-hidden",
        loading && "!animate-pulse",
        cardImageSize === "large"
          ? "aspect-video w-full"
          : "w-[70px] h-[70px] shrink-0",
      )}
    >
      {isVisible && (
        <Image
          ref={imgRef}
          alt=""
          src={imageUrl}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          radius="none"
          loading="lazy"
          removeWrapper
          classNames={{
            img: cn(
              "object-cover",
              cardImageSize === "large"
                ? "aspect-video w-full"
                : "aspect-square w-[70px]",
            ),
          }}
        />
      )}
    </div>
  );
}
