import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { Input, Kbd, Modal, ModalContent } from "@nextui-org/react";
import { Search as SearchIcon } from "lucide-react";
import { search, searchModalOpen, searchResults } from "@/stores/searchStore";
import SearchResults from "./SearchResults";
import { useNavigate } from "react-router-dom";

export default function SearchModal() {
  const navigate = useNavigate();
  const isOpen = useStore(searchModalOpen);
  const $searchResults = useStore(searchResults);
  const [keyword, setKeyword] = useState("");

  // 处理搜索
  const handleSearch = async (value) => {
    setKeyword(value);
    await search(value);
  };

  // 处理选择结果
  const handleSelect = (article) => {
    navigate(`/article/${article.id}`);
    searchModalOpen.set(false);
    setKeyword("");
  };

  // 关闭弹窗时清空搜索
  useEffect(() => {
    if (!isOpen) {
      setKeyword("");
      searchResults.set([]);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => searchModalOpen.set(open)}
      backdrop="transparent"
      disableAnimation
      placement="center"
      classNames={{
        base: "max-w-xl m-2 max-h-[80vh] h-[440px] bg-content2/80 backdrop-blur-lg shadow-large",
      }}
    >
      <ModalContent>
        <Input
          autoFocus
          placeholder="搜索文章..."
          size="lg"
          value={keyword}
          radius="none"
          classNames={{
            mainWrapper: "border-b",
            inputWrapper:
              "shadow-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-transparent group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-transparent",
          }}
          startContent={<SearchIcon className="size-6 text-default-400" />}
          endContent={
            <Kbd classNames={{ content: "font-mono text-xs text-default-400" }}>
              ESC
            </Kbd>
          }
          onChange={(e) => handleSearch(e.target.value)}
        />
        <SearchResults
          results={$searchResults}
          keyword={keyword}
          onSelect={handleSelect}
        />
      </ModalContent>
    </Modal>
  );
}
