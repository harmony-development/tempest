<script lang="ts" setup>
import MessageTypeButton from "./MessageTypeButton.vue";
const emit = defineEmits(["update:messageType"]);
const updateType = (type: string) => emit("update:messageType", type);
</script>

<template>
	<div class="bg-surface-500 p-3 rounded-md flexcol gap-3">
		<p class="font-bold">
			{{ $t("attachment-types") }}
		</p>
		<hr class="border-surface-600" />
		<div class="grid grid-cols-3 gap-2 auto-cols-max w-max">
			<message-type-button styling="bg-purple-600" :label="$t('photos')" @click="updateType('image')">
				<mdi:picture />
			</message-type-button>
			<message-type-button styling="bg-emerald-600" :label="$t('files')" @click="updateType('file')">
				<mdi:file />
			</message-type-button>
			<message-type-button styling="bg-blue-600" :label="$t('location')" @click="updateType('location')">
				<mdi:crosshairs-gps />
			</message-type-button>
			<message-type-button styling="bg-blue-600" :label="$t('woozy')" @click="updateType('woozy')">
				<twemoji:woozy-face />
			</message-type-button>
		</div>
	</div>
</template>
