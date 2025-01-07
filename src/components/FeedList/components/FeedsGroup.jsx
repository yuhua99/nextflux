import { useStore } from "@nanostores/react";
import {
  feedsByCategory,
  getCategoryCount,
  getFeedCount,
} from "@/stores/feedsStore.js";
import { cn } from "@/lib/utils";
import { ChevronRight, TriangleAlert } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import { Link, useParams } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import FeedIcon from "@/components/ui/FeedIcon";
import { settingsState } from "@/stores/settingsStore";

const FeedsGroup = () => {
  const $feedsByCategory = useStore(feedsByCategory);
  const $getCategoryCount = useStore(getCategoryCount);
  const $getFeedCount = useStore(getFeedCount);
  const { isMobile, setOpenMobile } = useSidebar();
  const { categoryId, feedId } = useParams();
  const { defaultExpandCategory } = useStore(settingsState);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>订阅源</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {$feedsByCategory.map((category) => (
            <Collapsible
              key={category.id}
              defaultOpen={
                defaultExpandCategory ||
                category.feeds.some(
                  (feed) => parseInt(feedId) === feed.id,
                )
              }
            >
              <SidebarMenuItem key={`menu-${category.id}`}>
                <SidebarMenuButton
                  className={cn(
                    categoryId === category.id && "bg-default rounded-md",
                  )}
                  asChild
                >
                  <Link
                    to={`/category/${category.id}`}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <span className={"pl-6"}>{category.title}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="left-2 hover:bg-default text-default-500 data-[state=open]:rotate-90">
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuBadge className="justify-end">
                  {$getCategoryCount(category.feeds) !== 0 &&
                    $getCategoryCount(category.feeds)}
                </SidebarMenuBadge>
                <CollapsibleContent>
                  <SidebarMenuSub className="m-0 px-0 border-none">
                    {category.feeds.map((feed) => (
                      <SidebarMenuSubItem key={feed.id}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "pl-8 pr-2 h-8",
                            parseInt(feedId) === feed.id &&
                              "bg-default rounded-md",
                          )}
                        >
                          <Link
                            to={`/feed/${feed.id}`}
                            onClick={() => isMobile && setOpenMobile(false)}
                          >
                            <FeedIcon url={feed.site_url} />
                            <span className="flex-1 flex items-center gap-1">
                              {feed.parsing_error_count > 0 && (
                                <span className="text-warning">
                                  <TriangleAlert className="size-4" />
                                </span>
                              )}
                              <span className="line-clamp-1">{feed.title}</span>
                            </span>
                            <span className="text-default-400 text-xs">
                              {$getFeedCount(feed.id) !== 0 &&
                                $getFeedCount(feed.id)}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default FeedsGroup;
