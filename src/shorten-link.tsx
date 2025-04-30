import {
	Action,
	ActionPanel,
	Clipboard,
	Form,
	showToast,
	Toast,
} from "@raycast/api";
import { useForm } from "@raycast/utils";
import { createLink } from "./services/api";
import { urlValidation, slugValidation } from "./services/validation";

interface FormValues {
	url: string;
	slug: string;
	description?: string;
}

export default function Command() {
	const { handleSubmit, itemProps } = useForm<FormValues>({
		validation: {
			url: (value) => {
				const result = urlValidation.format(value);
				if (!result.isValid) return result.message;
			},
			// TODO: 在 onChange 时调用验证器验证本地缓存 https://developers.raycast.com/api-reference/user-interface/form#validation
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

				toast.style = Toast.Style.Success;
				toast.title = "Link shortened successfully";
				toast.message = `Copied to clipboard: ${response.short_url}`;
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
