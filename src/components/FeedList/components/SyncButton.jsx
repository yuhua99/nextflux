import { useStore } from "@nanostores/react";
import { Button } from "@nextui-org/react";
import { forceSync, isOnline, isSyncing } from "@/stores/syncStore.js";
import { RefreshCw } from "lucide-react";

const SyncButton = () => {
  const $isOnline = useStore(isOnline);
  const $isSyncing = useStore(isSyncing);

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (err) {
      console.error("强制同步失败:", err);
    }
  };

  return (
    <Button
      onPress={handleForceSync}
      isDisabled={$isSyncing || !$isOnline}
      isLoading={$isSyncing}
      size="sm"
      radius="full"
      variant="light"
      isIconOnly
    >
      <RefreshCw className="size-4 text-default-500" />
    </Button>
  );
};

export default SyncButton;
