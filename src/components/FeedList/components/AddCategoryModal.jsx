import { Button, Divider, Input } from "@heroui/react";
import { useState } from "react";
import { addCategoryModalOpen } from "@/stores/modalStore";
import { useStore } from "@nanostores/react";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { categories } from "@/stores/feedsStore";
import { toast } from "sonner";
import CategoryChip from "./CategoryChip.jsx";
import { useTranslation } from "react-i18next";
import CustomModal from "@/components/ui/CustomModal.jsx";

export default function AddCategoryModal() {
  const { t } = useTranslation();
  const $addCategoryModalOpen = useStore(addCategoryModalOpen);
  const $categories = useStore(categories);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const onClose = () => {
    addCategoryModalOpen.set(false);
    setTitle("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await minifluxAPI.createCategory(title);
      await forceSync();
      onClose();
      toast.success(t("common.success"));
    } catch (error) {
      console.error("添加分类失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <form
      onSubmit={handleSubmit}
      className="justify-center items-center flex flex-col gap-4 px-4 pb-4"
    >
      <Input
        isRequired
        labelPlacement="outside"
        size="sm"
        label={t("sidebar.categoryName")}
        variant="faded"
        name="title"
        placeholder={t("sidebar.categoryNamePlaceholder")}
        errorMessage={t("sidebar.categoryNameRequired")}
        value={title}
        onValueChange={setTitle}
      />
      <Divider className="my-2" />
      <div className="flex flex-wrap gap-2 p-3 bg-content2 rounded-lg">
        {$categories.map((category) => (
          <CategoryChip key={category.id} category={category} />
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
          size="sm"
          variant="flat"
          fullWidth
        >
          {t("common.save")}
        </Button>
        <Button fullWidth onPress={onClose} size="sm" variant="flat">
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );

  return (
    <CustomModal
      open={$addCategoryModalOpen}
      onOpenChange={onClose}
      title={t("sidebar.addCategory")}
      content={content}
    />
  );
}
