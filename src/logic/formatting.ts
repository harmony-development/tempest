// interface CleanedFormat {
// 	italic: boolean
// 	bold: boolean
// 	underline: boolean
// }

/**
 * Generates anchors for the text.
 */
export function linkify(text: string): string {
	return text
		.split(/\s/)
		.map(word => word.startsWith("http") ? `<a target="_blank" href="${word}">${word}</a>` : word)
		.join(" ");
}

export function nearestOverlap(f: number[], formats: number[][]) {
	return Math.min(...formats.map(f2 => Math.max(f[0], f2[0])));
}

// function transformFormats(formats: Format[]): CleanedFormat[] {
// 	const res: CleanedFormat[] = [];
// 	for (const f of formats) {
// 		const nearestOverlap = Math.max(...formats.map(f2 => Math.max(f.start, f2.start)));
// 	}
// 	return res;
// }
