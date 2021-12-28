import { describe, expect, test } from "vitest";
import { linkify, nearestOverlap } from "../src/logic/formatting";

describe.concurrent("linkification", () => {
	const cases = [
		{
			given: "http://example.com",
			expected: "<a target=\"_blank\" href=\"http://example.com\">http://example.com</a>",
		},
		{
			given: "fumo fumo http://example.com/foo mufo mufo",
			expected: "fumo fumo <a target=\"_blank\" href=\"http://example.com/foo\">http://example.com/foo</a> mufo mufo",
		},
		{
			given: "fumo fumo\nhttp://example.com/foo mufo mufo",
			expected: "fumo fumo <a target=\"_blank\" href=\"http://example.com/foo\">http://example.com/foo</a> mufo mufo",
		},
		{
			given: "fumo fumo\nhttps://example.com/foo mufo mufo",
			expected: "fumo fumo<a target=\"_blank\" href=\"https://example.com/foo\">https://example.com/foo</a> mufo mufo",
		},
	];

	cases.forEach(({ given, expected }) => {
		test(`${given} should format to ${expected}`, () => {
			expect(linkify(given)).toEqual(expected);
		});
	});
});

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
