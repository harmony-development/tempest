<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import HBtn from "~/components/shared/HBtn.vue";
import { parseUserHost } from "~/logic/parsing";
import AddServerDialog from "./AddServerDialog.vue";
import { serverList } from "./state";

const router = useRouter();
const addingServer = ref(false);
const selectedServer = ref(0);

const deleteItem = (index: number) => {
  serverList.value.splice(index, 1);
};

const addServer = (name: string, host: string) => {
  serverList.value.unshift({ name, host });
  addingServer.value = false;
};

const nextClicked = () => {
  const { host } = serverList.value[selectedServer.value];
  if (!host) return;
  router.push({
    name: "auth",
    params: {
      host: parseUserHost(host),
    },
  });
};
</script>

<template>
  <add-server-dialog
    v-model="addingServer"
    @cancel="addingServer = false"
    @done="addServer"
  />
  <h1 class="text-lg font-bold">Welcome to Tempest</h1>
  <div class="text-sm w-full">
    <h-btn variant="filled" color="secondary" @click="addingServer = true"
      >Add Server</h-btn
    >
  </div>
  <ol>
    <h-list-item
      v-for="({ name, host }, i) in serverList"
      :key="host"
      :selected="i === selectedServer"
      @click="selectedServer = i"
      @keydown.enter="selectedServer = i"
      class="server-entry"
    >
      <div class="text-sm">
        <p>{{ name }}</p>
        <p class="text-gray-400">{{ host }}</p>
      </div>
      <div class="flex-1" />
      <h-btn
        icon
        variant="text"
        @pointerdown.stop
        @click="deleteItem(i)"
        class="delete-button"
      >
        <mdi-delete />
      </h-btn>
    </h-list-item>
  </ol>
  <h-btn variant="outlined" class="w-min ml-auto" @click="nextClicked"
    >Next</h-btn
  >
</template>

<style lang="postcss" scoped>
.server-entry {
  .delete-button {
    visibility: hidden;
  }
  &:hover,
  &:focus-within {
    .delete-button {
      visibility: visible;
    }
  }
}
</style>
