import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { categories } from "@/stores/feedsStore";
import { addFeedModalOpen } from "@/stores/modalStore";
import minifluxAPI from "@/api/miniflux";
import { forceSync } from "@/stores/syncStore";
import { MiniCloseButton } from "@/components/ui/MiniCloseButton.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddFeedModal() {
  const { t } = useTranslation();
  const $categories = useStore(categories);
  const $addFeedModalOpen = useStore(addFeedModalOpen);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feed_url: "",
    category_id: "",
    crawler: false,
  });

  const onClose = () => {
    addFeedModalOpen.set(false);
    setFormData({
      feed_url: "",
      category_id: "",
      crawler: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await minifluxAPI.createFeed(
        formData.feed_url,
        formData.category_id,
        { crawler: formData.crawler },
      );
      await forceSync(); // 重新加载订阅源列表以更新UI
      onClose();
      // 导航到新增的订阅源
      console.log(response);
      navigate(`/feed/${response.feed_id}`);
    } catch (error) {
      console.error("添加订阅源失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={$addFeedModalOpen}
      onClose={onClose}
      placement="center"
      radius="md"
      size="sm"
      hideCloseButton
      classNames={{
        header: "px-4 py-3 flex justify-between text-base font-medium",
        body: "px-4 py-1",
        footer: "px-4 py-4",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <div>{t("sidebar.addFeed.title")}</div>
            <MiniCloseButton onClose={onClose} />
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                labelPlacement="outside"
                size="sm"
                label={t("sidebar.addFeed.feedUrl")}
                variant="faded"
                name="feed_url"
                placeholder={t("sidebar.addFeed.feedUrlPlaceholder")}
                errorMessage={t("sidebar.addFeed.feedUrlRequired")}
                value={formData.feed_url}
                onValueChange={(value) =>
                  setFormData({ ...formData, feed_url: value })
                }
              />
              <Select
                isRequired
                labelPlacement="outside"
                size="sm"
                label={t("sidebar.addFeed.feedCategory")}
                variant="faded"
                name="category_id"
                placeholder={t("sidebar.addFeed.feedCategoryPlaceholder")}
                errorMessage={t("sidebar.addFeed.feedCategoryRequired")}
                selectedKeys={[formData.category_id?.toString()]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: parseInt(e.target.value),
                  })
                }
              >
                {$categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </Select>
              <Checkbox
                name="crawler"
                size="sm"
                classNames={{
                  base: "w-full max-w-full p-0 mx-0 -mt-4 mb-1",
                  label: "mt-4",
                }}
                isSelected={formData.crawler}
                onValueChange={(value) =>
                  setFormData({ ...formData, crawler: value })
                }
              >
                <div className="line-clamp-1">
                  {t("sidebar.addFeed.feedCrawler")}
                </div>
                <div className="text-xs text-default-400 line-clamp-1">
                  {t("sidebar.addFeed.feedCrawlerDescription")}
                </div>
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose} size="sm">
              {t("common.cancel")}
            </Button>
            <Button color="primary" type="submit" isLoading={loading} size="sm">
              {t("common.save")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
