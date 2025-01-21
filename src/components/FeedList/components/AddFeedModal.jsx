import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Select,
  SelectItem,
  Textarea,
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
import { Plus } from "lucide-react";

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
    keeplist_rules: "",
    blocklist_rules: "",
    rewrite_rules: "",
  });

  const onClose = () => {
    addFeedModalOpen.set(false);
    setFormData({
      feed_url: "",
      category_id: "",
      crawler: false,
      keeplist_rules: "",
      blocklist_rules: "",
      rewrite_rules: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await minifluxAPI.createFeed(
        formData.feed_url,
        formData.category_id,
        {
          crawler: formData.crawler,
          keeplist_rules: formData.keeplist_rules,
          blocklist_rules: formData.blocklist_rules,
          rewrite_rules: formData.rewrite_rules,
        },
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
      scrollBehavior="inside"
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
        <ModalHeader>
          <div>{t("sidebar.addFeed")}</div>
          <MiniCloseButton onClose={onClose} />
        </ModalHeader>
        <ScrollShadow size={10}>
          <form onSubmit={handleSubmit} className="w-full overflow-y-auto">
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  labelPlacement="outside"
                  size="sm"
                  label={t("feed.feedUrl")}
                  variant="faded"
                  name="feed_url"
                  placeholder={t("feed.feedUrlPlaceholder")}
                  errorMessage={t("feed.feedUrlRequired")}
                  value={formData.feed_url}
                  onValueChange={(value) =>
                    setFormData({ ...formData, feed_url: value })
                  }
                />
                <Select
                  isRequired
                  labelPlacement="outside"
                  size="sm"
                  label={t("feed.feedCategory")}
                  variant="faded"
                  name="category_id"
                  placeholder={t("feed.feedCategoryPlaceholder")}
                  errorMessage={t("feed.feedCategoryRequired")}
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
                  <div className="line-clamp-1">{t("feed.feedCrawler")}</div>
                  <div className="text-xs text-default-400 line-clamp-1">
                    {t("feed.feedCrawlerDescription")}
                  </div>
                </Checkbox>
                <Accordion
                  isCompact
                  hideIndicator
                  className="p-0"
                  itemClasses={{
                    base: "p-0",
                    trigger: "p-0 gap-1 cursor-pointer",
                    title: "text-default-500 text-sm",
                    content: "flex flex-col gap-4 pt-4 pb-0",
                  }}
                >
                  <AccordionItem
                    key="advanced"
                    aria-label="advanced"
                    startContent={<Plus className="size-4 text-default-500" />}
                    title={t("feed.advancedOptions")}
                  >
                    <Input
                      labelPlacement="outside"
                      size="sm"
                      label={
                        <Link
                          isExternal
                          showAnchorIcon
                          color="foreground"
                          href="https://miniflux.app/docs/rules.html#feed-filtering-rules"
                          className="text-xs"
                        >
                          {t("feed.feedKeeplistRules")}
                        </Link>
                      }
                      variant="faded"
                      name="keeplist_rules"
                      placeholder={t("feed.feedKeeplistRulesPlaceholder")}
                      value={formData.keeplist_rules}
                      onValueChange={(value) =>
                        setFormData({ ...formData, keeplist_rules: value })
                      }
                    />
                    <Input
                      labelPlacement="outside"
                      size="sm"
                      label={
                        <Link
                          isExternal
                          showAnchorIcon
                          color="foreground"
                          href="https://miniflux.app/docs/rules.html#feed-filtering-rules"
                          className="text-xs"
                        >
                          {t("feed.feedBlocklistRules")}
                        </Link>
                      }
                      variant="faded"
                      name="blocklist_rules"
                      placeholder={t("feed.feedBlocklistRulesPlaceholder")}
                      value={formData.blocklist_rules}
                      onValueChange={(value) =>
                        setFormData({ ...formData, blocklist_rules: value })
                      }
                    />
                    <Textarea
                      labelPlacement="outside"
                      size="sm"
                      label={
                        <Link
                          isExternal
                          showAnchorIcon
                          color="foreground"
                          href="https://miniflux.app/docs/rules.html#rewrite-rules"
                          className="text-xs"
                        >
                          {t("feed.feedRewriteRules")}
                        </Link>
                      }
                      isClearable
                      variant="faded"
                      name="rewrite_rules"
                      placeholder={t("feed.feedRewriteRulesPlaceholder")}
                      value={formData.rewrite_rules}
                      onValueChange={(value) =>
                        setFormData({ ...formData, rewrite_rules: value })
                      }
                    />
                  </AccordionItem>
                </Accordion>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="flat"
                onPress={onClose}
                size="sm"
              >
                {t("common.cancel")}
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={loading}
                size="sm"
              >
                {t("common.save")}
              </Button>
            </ModalFooter>
          </form>
        </ScrollShadow>
      </ModalContent>
    </Modal>
  );
}
