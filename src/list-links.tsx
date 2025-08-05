import { List, LocalStorage } from "@raycast/api";
import { useState, useEffect, useMemo } from "react";
import { useLinks } from "./hooks/useLinks";
import { LinkItem } from "./components/LinkItem";
import { searchLinks } from "./services/search";
import { sortLinks, getSortLabel, isValidSortOption } from "./services/sort";
import type { SortOption } from "./types";

interface LaunchProps {
  launchContext?: {
    searchText?: string;
  };
}

export default function Command(props: LaunchProps) {
  const { data: links, isLoading, revalidate } = useLinks();
  const [keyword, setKeyword] = useState(props.launchContext?.searchText || "");
  const [sortBy, setSortBy] = useState<SortOption>("created_desc");
  const [isLoadingSort, setIsLoadingSort] = useState(true);

  // Load saved sort preference
  useEffect(() => {
    LocalStorage.getItem<string>("link-sort-preference").then((stored) => {
      if (stored && isValidSortOption(stored)) {
        setSortBy(stored as SortOption);
      }
      setIsLoadingSort(false);
    });
  }, []);

  // Save sort preference
  const handleSortChange = async (newSort: SortOption) => {
    setSortBy(newSort);
    await LocalStorage.setItem("link-sort-preference", newSort);
  };

  // Apply sorting
  const sortedLinks = useMemo(() => {
    if (!links) return [];
    return sortLinks(links, sortBy);
  }, [links, sortBy]);

  // Apply search filter
  const filteredLinks = searchLinks(sortedLinks, keyword);

  return (
    <List
      navigationTitle={!isLoadingSort ? `Links - ${getSortLabel(sortBy)}` : "Links"}
      searchBarPlaceholder="Search by Slug, URL or Description"
      isLoading={isLoading || isLoadingSort}
      onSearchTextChange={setKeyword}
      searchText={keyword}
      filtering={false} // Disable Raycast's built-in filtering
      throttle // Optimize performance with throttling
    >
      <List.Section
        title={`${filteredLinks.length} links`}
        subtitle={!isLoadingSort ? getSortLabel(sortBy) : undefined}
      >
        {filteredLinks.map((link) => (
          <LinkItem
            key={link.short_code}
            link={link}
            onRefresh={revalidate}
            currentSort={sortBy}
            onSortChange={handleSortChange}
          />
        ))}
      </List.Section>
    </List>
  );
}
