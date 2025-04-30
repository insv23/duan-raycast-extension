import { List } from "@raycast/api";
import { LinkItem } from "./components/LinkItem";
import { useLinks } from "./hooks/useLinks";

export default function Command() {
	const { data: links, isLoading } = useLinks();

	return (
		<List isLoading={isLoading}>
			{links.map((link) => (
				<LinkItem key={link.short_code} link={link} />
			))}
		</List>
	);
}
