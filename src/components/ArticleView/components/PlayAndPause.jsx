import { Button, Card, CardHeader, Image } from "@nextui-org/react";
import {
  activeAudio,
  artist,
  artwork,
  paused,
  title,
} from "@/stores/audioStore.js";
import { activeArticle } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Pause, Play } from "lucide-react";
import { cn, extractFirstImage } from "@/lib/utils.js";

export default function PlayAndPause({ source }) {
  const $paused = useStore(paused);
  const $activeArticle = useStore(activeArticle);
  const $activeAudio = useStore(activeAudio);
  return (
    <Card
      className={cn(
        "playAndPause mx-auto my-16 w-60 aspect-square max-w-full bg-content2",
        !$paused && $activeAudio === source && "scale-[1.15]",
      )}
    >
      <CardHeader className="absolute z-10 top-1 w-full h-full flex-col items-center justify-center">
        <Button
          className="bg-white text-default-500 shadow-custom"
          radius="full"
          isIconOnly
          onPress={() => {
            activeAudio.set(source);
            paused.set($activeAudio === source && !$paused);
            title.set($activeArticle.title);
            artist.set($activeArticle.author);
            artwork.set(extractFirstImage($activeArticle) || "");
          }}
        >
          {$paused || $activeAudio !== source ? (
            <Play className="size-4 fill-current ml-0.5" />
          ) : (
            <Pause className="size-4 fill-current" />
          )}
        </Button>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={extractFirstImage($activeArticle) || ""}
      />
    </Card>
  );
}
