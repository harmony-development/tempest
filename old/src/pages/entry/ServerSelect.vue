<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import HSpacer from "~/components/HSpacer.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { hostList } from "~/logic/entry";
import { parseUserHost } from "~/logic/utils/parsing";

import HDialog from "~/components/HDialog.vue";

const AddServerDialog = defineAsyncComponent(
  () => import("../../components/auth/addserverdialog.vue")
);

const router = useRouter();

const addServerOpen = ref(false);
const selectedHost = ref<string | undefined>(undefined);
const selectedIdx = ref<number>(0);

const removeServer = (idx: number) => {
  hostList.value.splice(idx, 1);
};
const onNextClicked = () => {
  router.push({
    name: "authpage",
    params: {
      host: parseUserHost(selectedHost.value!),
    },
  });
};

const changeSelection = (idx: number) => {
  selectedIdx.value = idx;
  selectedHost.value = hostList.value[idx].host;
};
</script>

<template>
  <form @submit.prevent="">
    <h1 v-t="'entry.serverselect.title'" class="text-xl mb-4" />
    <h-btn
      v-t="'auth.add-server'"
      class="mb-4"
      variant="filled"
      color="primary"
      type="button"
      @click="addServerOpen = true"
    />
    <h-dialog v-model="addServerOpen">
      <add-server-dialog v-if="addServerOpen" v-model="addServerOpen" />
    </h-dialog>
    <h-list class="bg-white mb-4 bg-surface-700">
      <h-list-item
        v-for="(entry, idx) in hostList"
        :key="entry.host"
        :selected="selectedHost === entry.host"
        class="flex gap-3"
        @click="changeSelection(idx)"
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
          type="button"
          @pointerdown.stop
          @click.stop="removeServer(idx)"
        >
          <mdi-delete />
        </h-btn>
      </h-list-item>
    </h-list>

    <div class="flex justify-end">
      <h-btn
        v-t="'button.next'"
        variant="filled"
        color="primary"
        :disabled="!selectedHost"
        type="submit"
        @click="onNextClicked"
      />
    </div>
  </form>
</template>
