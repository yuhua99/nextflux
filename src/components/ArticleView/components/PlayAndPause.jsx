import { Button, Card, CardHeader, Image } from "@nextui-org/react";
import { activeAudio, audioState } from "@/stores/audioStore.js";
import { activeArticle } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Pause, Play } from "lucide-react";
import { cn, extractFirstImage } from "@/lib/utils.js";
import cover from "@/assets/cover.jpg";
import { useEffect, useState } from "react";

export default function PlayAndPause({ source }) {
  const { paused, loading } = useStore(audioState);
  const $activeArticle = useStore(activeArticle);
  const $activeAudio = useStore(activeAudio);
  const [currentPlaying, setCurrentPlaying] = useState(false);

  useEffect(() => {
    setCurrentPlaying(!paused && $activeAudio?.id === source.id);
  }, [paused, source, $activeAudio]);

  return (
    <Card
      className={cn(
        "playAndPause mx-auto my-16 w-60 aspect-square max-w-full bg-content2",
        currentPlaying ? "scale-[1.15]" : "",
      )}
    >
      <CardHeader className="absolute z-10 top-1 w-full h-full flex-col items-center justify-center">
        {!currentPlaying ? (
          <Button
            className="bg-white text-black/60 shadow-custom"
            radius="full"
            isLoading={loading}
            isIconOnly
            onPress={() => {
              activeAudio.set(source);
              audioState.setKey("loading", true);
              audioState.setKey("title", $activeArticle.title);
              audioState.setKey("artist", $activeArticle.author);
              audioState.setKey("paused", false);
              audioState.setKey(
                "artwork",
                extractFirstImage($activeArticle) || "",
              );
            }}
          >
            <Play className="size-4 fill-current" />
          </Button>
        ) : (
          <Button
            className="bg-white text-black/60 shadow-custom"
            radius="full"
            isLoading={loading}
            isIconOnly
            onPress={() => {
              audioState.setKey("paused", true);
            }}
          >
            <Pause className="size-4 fill-current" />
          </Button>
        )}
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={extractFirstImage($activeArticle) || cover}
      />
    </Card>
  );
}
