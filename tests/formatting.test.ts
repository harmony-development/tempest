import { describe, expect, test } from "vitest";
import { getLinks, linkify } from "../src/logic/formatting";

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
			expected: "fumo fumo\n<a target=\"_blank\" href=\"http://example.com/foo\">http://example.com/foo</a> mufo mufo",
		},
	];

	cases.forEach(({ given, expected }) => {
		test(`${given} should format to ${expected}`, () => {
			expect(linkify(given)).toEqual(expected);
		});
	});
});

describe.concurrent("get links", () => {
	test("can find all the links", () => {
		expect(getLinks("A https://example.com/foo Bsdf http://google.com")).toEqual(["https://example.com/foo", "http://google.com"]);
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
