import { List } from "@raycast/api";
import { useState } from "react";
import { useLinks } from "./hooks/useLinks";
import { LinkItem } from "./components/LinkItem";
import { searchLinks } from "./services/search";

export default function Command() {
	const { data: links, isLoading, revalidate } = useLinks();
	const [searchText, setSearchText] = useState("");

	const filteredLinks = searchLinks(links, searchText);

	return (
		<List
			searchBarPlaceholder="Search by Slug, URL or Description"
			isLoading={isLoading}
			onSearchTextChange={setSearchText}
			filtering={false} // Disable Raycast's built-in filtering
			throttle // Optimize performance with throttling
		>
			{filteredLinks.map((link) => (
				<LinkItem key={link.short_code} link={link} onRefresh={revalidate} />
			))}
		</List>
	);
}
