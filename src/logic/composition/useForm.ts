import type { Ref } from "vue";
import { computed, ref } from "vue";

export function useForm<T extends object>(
	defaults: Ref<Partial<T>>
): {
	displayValues: Ref<Partial<T>>;
	isDirty: Ref<boolean>;
	changedValues: Ref<Partial<T>>;
	reset: () => void;
} {
	const changedValues = ref({}) as Ref<Partial<T>>;

	const displayValues = computed(() => ({
		...defaults.value,
		...changedValues.value,
	}));

	const isDirty = computed(() => Object.entries(changedValues.value).every(([key, value]) => (defaults.value as any)[key] === value));

	const reset = () => (changedValues.value = {});

	return { displayValues, isDirty, changedValues, reset };
}
