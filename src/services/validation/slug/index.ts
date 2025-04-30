import { getLink } from "../../api";
import type { ValidationResult, SlugValidationRules } from "./types";

/**
 * 函数签名：
 * value: string | undefined - 参数可以是字符串或 undefined
 * value is string - 这是类型谓词（type predicate），告诉 TypeScript 如果函数返回 true，那么 value 的类型就是 string
 *
 * 函数实现：
 * typeof value === 'string' - 首先检查 value 是否为字符串类型（排除 undefined）
 * value.length > 0 - 然后检查字符串是否非空
 */
function isNonEmptyString(value: string | undefined): value is string {
	return typeof value === "string" && value.length > 0;
}

export const validateSlugFormat = (
	value: string | undefined,
): ValidationResult => {
	if (!isNonEmptyString(value)) {
		return {
			isValid: false,
			message: "Slug is required",
		};
	}

	// 检查格式是否符合要求
	if (!value.match(/^[a-zA-Z0-9-_]+$/)) {
		return {
			isValid: false,
			message:
				"Slug can only contain letters, numbers, hyphens and underscores",
		};
	}

	return { isValid: true };
};

export const validateSlugAvailability = async (
	// FIXME:  Raycast  useForm 的验证器不支持异步验证，实现缓存后在本地验证
	value: string,
): Promise<ValidationResult> => {
	try {
		await getLink(value);
		return {
			isValid: false,
			message: "This slug is already taken. Please choose another one.",
		};
	} catch (error) {
		return { isValid: true };
	}
};

export const validateSlug = async (
	value: string | undefined,
): Promise<ValidationResult> => {
	if (!isNonEmptyString(value)) {
		return {
			isValid: false,
			message: "Slug is required",
		};
	}

	const formatResult = validateSlugFormat(value);
	if (!formatResult.isValid) {
		return formatResult;
	}

	return await validateSlugAvailability(value);
};

export const slugValidation: SlugValidationRules = {
	format: validateSlugFormat,
	availability: validateSlugAvailability,
};
