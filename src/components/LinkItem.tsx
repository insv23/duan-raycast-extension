import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";
import type { Link } from "../types";
import type { Preferences } from "../types";
import { LinkDetail } from "./LinkDetail";
import { deleteLink } from "../services/api";

interface LinkItemProps {
	link: Link;
}

export const LinkItem = ({ link }: LinkItemProps) => {
	const BASE_URL = getPreferenceValues<Preferences>().host;
	const shortUrl = `${BASE_URL}/${link.short_code}`;

	const handleDelete = async () => {
		await deleteLink(link.short_code);
		// TODO: 刷新
	};

	return (
		<List.Item
			icon={link.is_enabled ? undefined : Icon.EyeDisabled}
			title={link.short_code}
			subtitle={link.original_url}
			accessories={[
				{
					text: link.description || "",
				},
				{
					text: link.visit_count.toString(),
					icon: Icon.Footprints,
				},
			]}
			actions={
				<ActionPanel>
					<Action.CopyToClipboard
						icon={Icon.Clipboard}
						title="Copy Short Link"
						content={shortUrl}
					/>
					<Action.Push
						icon={Icon.Paragraph}
						title="Edit"
						target={<LinkDetail link={link} onRefresh={() => {}} />} // TODO: 刷新
					/>
					<Action
						icon={Icon.Trash}
						title="Delete Link"
						onAction={handleDelete} // 删除使用 confirmAlert
					/>
				</ActionPanel>
			}
		/>
	);
};
