import { Button } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import { addFeedModalOpen } from "@/stores/modalStore";

export default function AddFeedButton() {
  return (
    <Button
      size="sm"
      radius="full"
      variant="light"
      isIconOnly
      onPress={() => addFeedModalOpen.set(true)}
    >
      <CirclePlus className="size-4 text-default-500" />
    </Button>
  );
}
