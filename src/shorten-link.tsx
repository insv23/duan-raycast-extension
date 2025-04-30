import {
	Action,
	ActionPanel,
	Clipboard,
	Form,
	showToast,
	showHUD,
	Toast,
} from "@raycast/api";
import { useEffect } from "react";
import { useForm } from "@raycast/utils";
import { createLink, getShortcodes } from "./services/api";
import { urlValidation, slugValidation } from "./services/validation";
import { setUsedSlugs } from "./services/validation/slug/cache";

interface FormValues {
	url: string;
	slug: string;
	description?: string;
}

export default function Command() {
	// 在 Shorten Link 命令加载时获取并缓存所有已使用的 slugs
	useEffect(() => {
		const initializeSlugCache = async () => {
			const toast = await showToast({
				style: Toast.Style.Animated,
				title: "Initializing slug cache...",
			});

			try {
				const slugs = await getShortcodes();
				setUsedSlugs(slugs);

				toast.style = Toast.Style.Success;
				toast.title = "Slug cache initialized";
			} catch (error) {
				toast.style = Toast.Style.Failure;
				toast.title = "Failed to initialize slug cache";
				toast.message =
					error instanceof Error ? error.message : "Unknown error occurred";
			}
		};

		initializeSlugCache();
	}, []);

	const { handleSubmit, itemProps } = useForm<FormValues>({
		validation: {
			url: (value) => {
				const result = urlValidation.format(value);
				if (!result.isValid) return result.message;
			},
			slug: (value) => {
				const result = slugValidation.format(value);
				if (!result.isValid) return result.message;
			},
		},
		async onSubmit(values) {
			const toast = await showToast({
				style: Toast.Style.Animated,
				title: "Creating short link...",
			});

			try {
				const response = await createLink({
					url: values.url,
					short_code: values.slug,
					description: values.description || null,
				});

				await Clipboard.copy(response.short_url);

				// 使用 HUD 替代 Toast，因为 Clipboard.copy 操作会关闭窗口
				await showHUD(`Copied ${response.short_url}`);
			} catch (error) {
				toast.style = Toast.Style.Failure;
				toast.title = "Failed to create short link";
				toast.message =
					error instanceof Error ? error.message : "Unknown error occurred";
			}
		},
	});

	return (
		<Form
			enableDrafts
			actions={
				<ActionPanel>
					<Action.SubmitForm
						title="Create Short Link"
						onSubmit={handleSubmit}
					/>
				</ActionPanel>
			}
		>
			<Form.TextField
				{...itemProps.url}
				title="URL"
				placeholder="https://a-very-long-url.com"
				autoFocus
			/>
			<Form.TextField
				{...itemProps.slug}
				title="Slug"
				placeholder="custom-slug"
			/>
			<Form.TextField
				{...itemProps.description}
				title="Description"
				placeholder="Optional description for this link"
			/>
		</Form>
	);
}
