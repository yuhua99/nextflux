import { Button, Form, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { renameModalOpen, currentCategory } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { useTranslation } from "react-i18next";
import CustomModal from "@/components/ui/CustomModal.jsx";

export default function RenameModal() {
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const $renameModalOpen = useStore(renameModalOpen);
  const $currentCategory = useStore(currentCategory);

  useEffect(() => {
    setNewTitle($currentCategory?.title);
  }, [$currentCategory]);

  const onClose = () => {
    renameModalOpen.set(false);
    setNewTitle($currentCategory?.title);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.updateCategory($currentCategory.id, newTitle);
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
    } catch (error) {
      console.error("重命名分类失败:", error);
    } finally {
      setLoading(false);
      setNewTitle(""); // 重置输入框
    }
  };

  return (
    <CustomModal
      open={$renameModalOpen}
      onOpenChange={onClose}
      title={t("articleList.renameCategory.title")}
    >
      <Form
        className="w-full justify-center items-center flex flex-col gap-4 px-4 pb-4"
        validationBehavior="native"
        onSubmit={(e) => handleRename(e)}
      >
        <Input
          isRequired
          labelPlacement="outside"
          size="sm"
          label={t("articleList.renameCategory.categoryName")}
          variant="faded"
          name="title"
          placeholder={t("articleList.renameCategory.categoryNamePlaceholder")}
          errorMessage={t("articleList.renameCategory.categoryNameRequired")}
          value={newTitle}
          onValueChange={setNewTitle}
        />
        <div className="flex flex-col md:flex-row-reverse gap-2 w-full">
          <Button
            color="primary"
            fullWidth
            type="submit"
            isLoading={loading}
            size="sm"
            className="border-primary border shadow-custom-button bg-primary bg-gradient-to-b from-white/15 to-transparent text-sm"
          >
            {t("common.save")}
          </Button>
          <Button
            fullWidth
            onPress={onClose}
            size="sm"
            variant="flat"
            className="border text-sm"
          >
            {t("common.cancel")}
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
}
