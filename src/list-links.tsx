import { List } from "@raycast/api";
import { useLinks } from "./hooks/useLinks";
import { LinkItem } from "./components/LinkItem";

export default function Command() {
	const { data: links, isLoading, revalidate } = useLinks();

	return (
		<List isLoading={isLoading}>
			{links.map((link) => (
				<LinkItem key={link.short_code} link={link} onRefresh={revalidate} />
			))}
		</List>
	);
}
