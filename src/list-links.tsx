import { List } from "@raycast/api";
import { useState, useEffect } from "react";
import { getLinks } from "./services/api";
import { LinkItem } from "./components/LinkItem";
import type { Link } from "./types";

export default function Command() {
	const [links, setLinks] = useState<Link[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchLinks() {
			try {
				const data = await getLinks();
				setLinks(data);
			} catch (error) {
				console.error("Failed to fetch links:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchLinks();
	}, []);

	return (
		<List isLoading={isLoading}>
			{links.map((link) => (
				<LinkItem key={link.short_code} link={link} />
			))}
		</List>
	);
}
