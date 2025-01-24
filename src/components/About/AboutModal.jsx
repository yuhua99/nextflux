import { useTranslation } from "react-i18next";
import { useStore } from "@nanostores/react";
import { aboutModalOpen } from "@/stores/modalStore";
import { FancyLogo } from "@/components/About/FancyLogo.jsx";
import CustomModal from "@/components/ui/CustomModal.jsx";

export default function AboutModal() {
  const { t } = useTranslation();
  const $aboutModalOpen = useStore(aboutModalOpen);

  return (
    <CustomModal
      open={$aboutModalOpen}
      onOpenChange={() => aboutModalOpen.set(false)}
      title={t("about.title")}
      content={
        <div className="px-4 pb-4 space-y-6">
          <FancyLogo since="2025"/>
        </div>
      }
    />
  );
}
