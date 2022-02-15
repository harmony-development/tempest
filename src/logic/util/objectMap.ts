export const objectMap = <K extends string | number | symbol, V, VResult>(obj: Record<K, V>, fn: (v: V, k: K, i: number) => VResult) =>
	Object.fromEntries(
		Object.entries(obj).map(
			([k, v], i) => [k, fn(v as V, k as K, i)],
		),
	);
