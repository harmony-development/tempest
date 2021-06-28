<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AddServerDialog from "./addserverdialog.vue";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import HSpacer from "~/components/HSpacer.vue";
import HBtn from "~/components/HBtn.vue";
import { hostList } from "~/logics/entry";

const router = useRouter();

const addServerOpen = ref(false);
const selectedHost = ref<string | undefined>(undefined);

const removeServer = (idx: number) => {
  hostList.value.splice(idx, 1);
};
const onNextClicked = () => {
  let host = selectedHost.value!;
  if (host.includes("://")) host = `https${host.substr(host.indexOf("://"))}`;
  else host = `https://${host}`;
  const parsed = new URL(host);
  router.push({
    name: "authpage",
    params: {
      host: `https://${parsed.hostname}:${parsed.port || "2289"}`,
    },
  });
};
</script>

<template>
  <div>
    <h1 v-t="'entry.serverselect.title'" class="text-xl mb-4" />
    <h-btn
      v-t="'auth.add-server'"
      class="mb-4"
      variant="filled"
      color="primary"
      @click="addServerOpen = true"
    />
    <add-server-dialog v-model="addServerOpen" />
    <h-list class="bg-white mb-4 dark:bg-harmonydark-700">
      <h-list-item
        v-for="(entry, idx) in hostList"
        :key="entry.host"
        :selected="selectedHost === entry.host"
        @click="selectedHost = entry.host"
      >
        <div>
          <p class="text-sm">
            {{ entry.name }}
          </p>
          <p class="text-sm text-gray-400">
            {{ entry.host }}
          </p>
        </div>
        <h-spacer />
        <h-btn
          icon
          variant="text"
          @pointerdown.stop
          @click.stop="removeServer(idx)"
        >
          <mdi-delete />
        </h-btn>
      </h-list-item>
    </h-list>

    <div class="flex justify-end">
      <h-btn v-t="'button.back'" :variant="'text'" disabled class="mr-1" />
      <h-btn
        v-t="'button.next'"
        :variant="'filled'"
        :color="'primary'"
        :disabled="!selectedHost"
        @click="onNextClicked"
      />
    </div>
  </div>
</template>
