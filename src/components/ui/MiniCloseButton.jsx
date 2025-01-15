import { Card } from "@nextui-org/react";
import { X } from "lucide-react";

export function MiniCloseButton({ onClose }) {
  return (
    <Card
      isPressable
      shadow="none"
      onPress={onClose}
      classNames={{
        base: "w-4 h-4 bg-transparent hover:bg-content2 flex items-center justify-center",
      }}
    >
      <X className="h-[12px] w-[12px] text-default-500" />
    </Card>
  );
}
