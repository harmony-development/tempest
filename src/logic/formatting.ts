// interface CleanedFormat {
// 	italic: boolean
// 	bold: boolean
// 	underline: boolean
// }

export function getLinks(text: string): string[] {
	return text.split(/\s/).filter((word) => word.match(/^https?:\/\//));
}

/**
 * Generates anchors for the text.
 */
export function linkify(text: string): string {
	return text.replaceAll(/(?:www|https?)[^\s]+/gi, '<a target="_blank" href="$&">$&</a>');
}

interface IRange {
	start: number;
	end: number;
	traits: string[];
}

function sortRange(lhs: IRange, rhs: IRange): number {
	return lhs.start - rhs.start;
}

export function merge(ranges: IRange[]): Array<IRange> {
	ranges.sort(sortRange);

	const s = new Array<IRange>();

	s.push(ranges[0]);

	for (let i = 1; i < ranges.length; i++) {
		const top = s[s.length - 1];
		const against = ranges[i];

		/*
					|---top---|
												|---against---|
			 */
		if (top.end < against.start) {
			s.push(against);
			/*
					|---top---|
					|----against----|
			*/
		} else if (top.start === against.start && top.end < against.end) {
			s.pop();
			s.push({
				start: top.start,
				end: top.end,
				traits: top.traits.concat(against.traits),
			});
			s.push({
				start: top.end,
				end: against.end,
				traits: against.traits,
			});
			/*
					|---top---|
									|---against---|
			 */
		} else if (top.end < against.end) {
			s.pop();
			s.push({
				start: top.start,
				end: against.start,
				traits: top.traits,
			});
			s.push({
				start: against.start,
				end: top.end,
				traits: top.traits.concat(against.traits),
			});
			s.push({
				start: top.end,
				end: against.end,
				traits: against.traits,
			});
			/*
					|--------top--------|
							|---against---|
			 */
		} else if (top.start < against.start && top.end > against.end) {
			s.pop();
			s.push({
				start: top.start,
				end: against.start,
				traits: top.traits,
			});
			s.push({
				start: against.start,
				end: against.end,
				traits: top.traits.concat(against.traits),
			});
			s.push({
				start: against.end,
				end: top.end,
				traits: top.traits,
			});
		} else {
			console.warn(top, against);
			throw new Error("unhandled case");
		}
	}

	return s;
}
