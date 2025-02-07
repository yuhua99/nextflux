import { Button } from "@heroui/react";
import { Search } from "lucide-react";
import { searchModalOpen } from "@/stores/searchStore.js";
export default function MenuButton() {
  return (
    <Button
      size="sm"
      radius="full"
      variant="light"
      isIconOnly
      onPress={() => searchModalOpen.set(true)}
    >
      <Search className="size-4 text-default-500" />
    </Button>
  );
}
