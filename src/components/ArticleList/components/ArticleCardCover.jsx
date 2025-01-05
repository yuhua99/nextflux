import { useRef, useState } from "react";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils.js";
import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { useInView } from "framer-motion";

export default function ArticleCardCover({ imageUrl }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);
  const { cardImageSize } = useStore(settingsState);
  const isInView = useInView(imgRef);

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
          : "w-20 h-20 shrink-0",
      )}
    >
      {isInView && (
        <Image
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
                : "aspect-square w-20",
            ),
          }}
        />
      )}
    </div>
  );
}
