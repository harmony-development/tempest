import { describe, expect, test } from "vitest";
import { nearestOverlap } from "../src/logic/formatting";

describe.concurrent("nearest overlap calculation", () => {
	const cases = [
		{
			formatters: [
				[0, 5],
				[3, 8],
				[9, 13],
			],
		},
	];

	cases.forEach(({ formatters }) => {
		test(`${formatters}`, () => {
			expect(nearestOverlap(formatters[0], formatters.splice(0))).toBe(3);
		});
	});
});
