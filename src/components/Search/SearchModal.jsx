import { useCallback, useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  Divider,
  Input,
  Kbd,
  Modal,
  ModalContent,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Search as SearchIcon } from "lucide-react";
import {
  articlesCache,
  feedSearchResults,
  loadArticlesCache,
  search,
  searchFeeds,
  searchModalOpen,
  searchResults,
} from "@/stores/searchStore";
import SearchResults from "./SearchResults";
import { useNavigate } from "react-router-dom";
import { settingsState } from "@/stores/settingsStore";

export default function SearchModal() {
  const navigate = useNavigate();
  const isOpen = useStore(searchModalOpen);
  const $searchResults = useStore(searchResults);
  const $feedSearchResults = useStore(feedSearchResults);
  const { showHiddenFeeds } = useStore(settingsState);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("articles");
  const [isComposing, setIsComposing] = useState(false);

  // 处理搜索
  const handleSearch = useCallback(
    async (value) => {
      if (searchType === "articles") {
        await search(value);
      } else {
        await searchFeeds(value);
      }
    },
    [searchType],
  );

  useEffect(() => {
    if (!isComposing) {
      handleSearch(keyword);
    }
  }, [keyword, searchType, handleSearch, showHiddenFeeds, isComposing]);

  // 处理选择结果
  const handleSelect = (item) => {
    if (searchType === "articles") {
      navigate(`/article/${item.id}`);
    } else {
      navigate(`/feed/${item.id}`);
    }
    searchModalOpen.set(false);
    setKeyword("");
  };

  // 打开时加载缓存，关闭时清空搜索
  useEffect(() => {
    if (isOpen) {
      if (searchType === "articles") {
        loadArticlesCache();
      }
    }
    if (!isOpen) {
      setKeyword("");
      searchResults.set([]);
      feedSearchResults.set([]);
      articlesCache.set([]);
      setSearchType("articles");
    }
  }, [isOpen, searchType]);

  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      onOpenChange={(open) => searchModalOpen.set(open)}
      backdrop="transparent"
      disableAnimation
      placement="center"
      classNames={{
        base: "max-w-xl m-2 max-h-[80vh] h-[440px] bg-content2/80 backdrop-blur-lg shadow-large",
      }}
    >
      <ModalContent>
        <div className="flex flex-col">
          <Input
            autoFocus
            placeholder={
              searchType === "articles" ? "搜索文章..." : "搜索订阅..."
            }
            size="lg"
            value={keyword}
            radius="none"
            classNames={{
              mainWrapper: "border-b",
              inputWrapper:
                "h-14 shadow-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-transparent group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-transparent",
            }}
            startContent={<SearchIcon className="size-6 text-default-400" />}
            endContent={
              <Kbd
                classNames={{ content: "font-mono text-xs text-default-400" }}
              >
                ESC
              </Kbd>
            }
            onValueChange={(value) => setKeyword(value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </div>
        <SearchResults
          results={
            searchType === "articles" ? $searchResults : $feedSearchResults
          }
          keyword={keyword}
          onSelect={handleSelect}
          type={searchType}
          isComposing={isComposing}
        />
        <div className="p-1.5 border-t flex items-center justify-between">
          <Tabs
            selectedKey={searchType}
            onSelectionChange={setSearchType}
            radius="md"
            classNames={{
              tabList: "bg-default/40 backdrop-blur-md gap-0",
              tab: "h-auto px-2",
              cursor: "w-full bg-default-400/90 shadow-none dark:bg-primary",
              tabContent:
                "text-xs text-default-500 font-semibold group-data-[selected=true]:text-default-50 dark:group-data-[selected=true]:text-foreground",
            }}
          >
            <Tab key="articles" title="文章" />
            <Tab key="feeds" title="订阅" />
          </Tabs>
          <div className="flex items-center gap-1 px-1">
            <Kbd keys="up" classNames={{ abbr: "text-xs text-default-500" }} />
            <Kbd
              keys="down"
              classNames={{ abbr: "text-xs text-default-500" }}
            />
            <span className="text-xs text-default-500 font-semibold">
              切换条目
            </span>
            <Divider orientation="vertical" className="h-5 mx-1" />
            <Kbd
              keys="enter"
              classNames={{ abbr: "text-xs text-default-500" }}
            />
            <span className="text-xs text-default-500 font-semibold">打开</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
