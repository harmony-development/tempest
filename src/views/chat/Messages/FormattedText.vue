<script lang="ts" setup>
import { FormattedText, Format, Format_Color, Format_Color_Kind, Format_Emoji } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed } from "vue";
import { linkify } from "~/logic/formatting";
import { parseHMC } from "~/logic/parsing";
import { useChatRoute } from "~/router";

const props = defineProps<{
	content: FormattedText
}>();


function merge(format: Format[]) {
	if (format.length == 0) {
		return []
	}

	let _ = format[0]
	type FormatKind = typeof _.format
	type AdjustedSpan = {
		start: number
		end: number
		formats: FormatKind[]
	}

	interface IStart { start: number }
	function sort(lhs: IStart, rhs: IStart): number {
		return lhs.start - rhs.start
	}
	function map(it: Format): AdjustedSpan {
		return { start: it.start, end: it.start + it.length, formats: [it.format] }
	}

	let ranges = format.map(map)
	ranges.sort(sort)

	const s = new Array<AdjustedSpan>()
	s.push(ranges[0])

	for (let i = 1; i < ranges.length; i++) {
		const top = s[s.length - 1]
		const against = ranges[i]

		/*
			|---top---|
							|---against---|
			*/
		if (top.end < against.start) {
			s.push(against)
			/*
				|---top---|
				|----against----|
			*/
		} else if (top.start == against.start && top.end < against.end) {
			s.pop()
			s.push({
				start: top.start,
				end: top.end,
				formats: top.formats.concat(against.formats)
			})
			s.push({
				start: top.end,
				end: against.end,
				formats: against.formats,
			})
			/*
				|---top---|
						|---against---|
				*/
		} else if (top.end < against.end) {
			s.pop()
			s.push({
				start: top.start,
				end: against.start,
				formats: top.formats,
			})
			s.push({
				start: against.start,
				end: top.end,
				formats: top.formats.concat(against.formats)
			})
			s.push({
				start: top.end,
				end: against.end,
				formats: against.formats,
			})
			/*
				|--------top--------|
					|---against---|
				*/
		} else if (top.start < against.start && top.end > against.end) {
			s.pop()
			s.push({
				start: top.start,
				end: against.start,
				formats: top.formats,
			})
			s.push({
				start: against.start,
				end: against.end,
				formats: top.formats.concat(against.formats)
			})
			s.push({
				start: against.end,
				end: top.end,
				formats: top.formats
			})
		} else if (top.start == against.start && top.end == against.end) {
			s.pop()
			s.push({
				start: top.start,
				end: against.end,
				formats: top.formats.concat(against.formats),
			})
		} else {
			throw [top, against]
		}
	}

	return s
}

const content = computed(() => {
	const { content } = props;

	const formatSpans = merge(content.format)

	const finalFormats = []
	let previousFormat
	for (const format of formatSpans) {
		if (previousFormat) {
			if (previousFormat.end != format.start) {
				finalFormats.push({ text: content.text.slice(previousFormat.end, format.start), formats: [] })
			}
		}
		finalFormats.push({ text: content.text.slice(format.start, format.end), formats: format.formats })
		previousFormat = format
	}
	if (previousFormat && previousFormat.end != content.text.length - 1) {
		finalFormats.push({ text: content.text.slice(previousFormat.end, content.text.length - 1), formats: [] })
	} else {
		finalFormats.push({ text: content.text, formats: [] })
	}
	
	return finalFormats
})

const pred = str => item => item.oneofKind === str

function classify(it) {
	const map: {[key: string]: boolean} = {}

	let ke: Array<any> = it.formats

	map["font-bold"] = ke.some(pred("bold"))
	map["italic"] = ke.some(pred("italic"))
	map["underline"] = ke.some(pred("underline"))
	map["font-mono"] = ke.some(pred("monospace"))
	map["align-super"] = ke.some(pred("superscript"))
	map["align-sub"] = ke.some(pred("subscript"))

	return map
}

function colorify(it) {
	const map: {[key: string]: boolean} = {}

	let ke: Array<Format_Color> = it.formats.filter(format => format.oneofKind == "color").map(format => format.color)

	map["dull"] = ke.some(color => color.kind == Format_Color_Kind.DIM_UNSPECIFIED)
	map["glowy"] = ke.some(color => color.kind == Format_Color_Kind.BRIGHT)
	map["text-cyan-400"] = ke.some(color => color.kind == Format_Color_Kind.INFO)
	map["text-rose-400"] = ke.some(color => color.kind == Format_Color_Kind.NEGATIVE)
	map["text-lime-400"] = ke.some(color => color.kind == Format_Color_Kind.POSITIVE)
	map["text-orange-400"] = ke.some(color => color.kind == Format_Color_Kind.WARNING)

	return map
}

const { host } = useChatRoute();

function emojiURL(it) {
	for (const format of it.formats) {
		if (format.oneofKind != "emoji")
			continue

		const emoji: Format_Emoji = format.emoji
		return parseHMC(emoji.imageHmc, host.value!)
	}
	return ""
}


const is = clas => item => item.formats.some(pred(clas))
const isCodeblock = is("codeBlock")
const isColor = is("color")
const isEmoji = is("emoji")

</script>

<template>
	<template v-for="item in content">
		<pre v-if="isCodeblock(item)" class="p-4 border border-white rounded my-2"><code>{{ item.text }}</code></pre>
		<span v-else-if="isColor(item)" :class="colorify(item)">{{ item.text }}</span>
		<img v-else-if="isEmoji(item)" :src="emojiURL(item)" class="max-w-4 min-w-4 inline" />
		<span
			v-else
			:class="classify(item)"
		>
			{{ item.text }}
		</span>
	</template>
</template>

<style scoped>
span {
	white-space: pre;
}
.align-super {
	vertical-align: super;
	@apply text-xs;
}
.align-sub {
	vertical-align: sub;
	@apply text-xs;
}

.glowy {
	text-shadow: 0px 0px 4px white;
}
.dull {
	opacity: 0.5;
}
</style>
