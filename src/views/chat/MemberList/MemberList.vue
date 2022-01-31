<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";
import { uiState } from "~/logic/store/ui";
import BaseListItem from "~/components/base/BaseListItem.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";

const { host, guild } = useChatRoute();
const members = computed(() => chatState.getMemberList(host.value!, guild.value!), undefined);
</script>

<template>
  <ol class="rounded-b-sm">
    <member-item v-for="m in members" :key="m" class="gap-2" :userid="m" :host="host!" />
  </ol>
</template>
