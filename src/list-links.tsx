import { List, LocalStorage, Icon } from "@raycast/api";
import { useState, useEffect, useMemo } from "react";
import { useLinks } from "./hooks/useLinks";
import { LinkItem } from "./components/LinkItem";
import { searchLinks } from "./services/search";
import { sortLinks, getSortLabel, isValidSortOption } from "./services/sort";
import { filterLinks, getFilterLabel } from "./services/filter";
import type { SortOption, FilterOption } from "./types";

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
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

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

  // Data processing pipeline: filter → sort → search
  const processedLinks = useMemo(() => {
    if (!links) return [];

    // Step 1: Apply filter
    const filtered = filterLinks(links, filterBy);

    // Step 2: Apply sorting
    const sorted = sortLinks(filtered, sortBy);

    // Step 3: Apply search
    return searchLinks(sorted, keyword);
  }, [links, filterBy, sortBy, keyword]);

  return (
    <List
      navigationTitle={!isLoadingSort ? `Links - ${getFilterLabel(filterBy)} - ${getSortLabel(sortBy)}` : "Links"}
      searchBarPlaceholder="Search by Slug, URL or Description"
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter Links"
          storeValue={true}
          onChange={(newValue) => setFilterBy(newValue as FilterOption)}
        >
          <List.Dropdown.Item title="All Links" value="all" icon={Icon.Circle} />
          <List.Dropdown.Item title="Active Links" value="active" icon={Icon.CheckCircle} />
          <List.Dropdown.Item title="Disabled Links" value="disabled" icon={Icon.XMarkCircle} />
        </List.Dropdown>
      }
      isLoading={isLoading || isLoadingSort}
      onSearchTextChange={setKeyword}
      searchText={keyword}
      filtering={false} // Disable Raycast's built-in filtering
      throttle // Optimize performance with throttling
    >
      <List.Section
        title={`${processedLinks.length} ${getFilterLabel(filterBy).toLowerCase()} links`}
        subtitle={!isLoadingSort ? getSortLabel(sortBy) : undefined}
      >
        {processedLinks.map((link) => (
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
