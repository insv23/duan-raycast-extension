export type ValidationResult = {
	isValid: boolean;
	message?: string;
};

export interface SlugValidationRules {
	format: (value: string | undefined) => ValidationResult;
	availability: (value: string) => Promise<ValidationResult>; // FIXME:  Raycast  useForm 的验证器不支持异步验证，实现缓存后在本地验证
}
