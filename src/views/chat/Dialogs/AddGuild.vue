<script lang="ts" setup>
import { ref } from "vue";
import HBtn from "~/components/shared/HBtn.vue";
import HInput from "~/components/shared/HInput.vue";
import { connectionManager } from "../../../logic/api/connections";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";

const screen = ref<"join" | "create">("join");
const joinCode = ref("");
const guildName = ref("");
const error = ref<any>(undefined);

const close = () => (uiState.state.addGuildDialog = false);

const onJoinClicked = async () => {
  try {
    await connectionManager.get(session.value!.host).chat.joinGuild({
      inviteId: joinCode.value,
    });
    close();
  } catch (e) {
    error.value = e;
  }
};

const onCreateClicked = async () => {
  try {
    await connectionManager.get(session.value!.host).chat.createGuild({
      name: guildName.value,
      picture: "",
    });
    close();
  } catch (e) {
    error.value = e;
  }
};
</script>

<template>
  <form class="flexcol gap-2" @submit.prevent v-if="screen === 'join'">
    <h1 class="text-xl">Join Guild</h1>
    <span class="text-red-400">{{ error?.code }}</span>
    <HInput label="Join Code" v-model="joinCode" />
    <a @click="screen = 'create'">Create guild?</a>
    <div class="flex justify-end gap-2">
      <HBtn variant="text" type="button" @click="close">Cancel</HBtn>
      <HBtn
        variant="text"
        color="primary"
        type="submit"
        @click="onJoinClicked"
        :disabled="!joinCode"
        >Join</HBtn
      >
    </div>
  </form>
  <form v-else class="flexcol gap-2" @submit.prevent>
    <h1 class="text-xl">Create Guild</h1>
    <span class="text-red-400">{{ error?.code }}</span>
    <HInput label="Guild Name" v-model="guildName" />
    <a @click="screen = 'join'">Join guild?</a>
    <div class="flex justify-end gap-2">
      <HBtn variant="text" type="button" @click="close">Cancel</HBtn>
      <HBtn
        variant="text"
        color="primary"
        type="submit"
        @click="onCreateClicked"
        :disabled="!guildName"
        >Create</HBtn
      >
    </div>
  </form>
</template>
