<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";

const { host, guild } = useChatRoute();
const members = computed(() => chatState.getMemberList(host.value!, guild.value!), undefined);
</script>

<template>
	<ol class="rounded-b-sm">
		<member-item v-for="m in members" :key="m" class="gap-2" :userid="m" :host="host!" />
	</ol>
</template>
