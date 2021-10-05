<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { session } from "../../logic/store/session";
import { connectionManager } from "../../logic/api/connections";
import { useRouter } from "vue-router";
import Splash from "./Splash.vue";
import GuildList from "./GuildList/GuildList.vue";

const sessionValidated = ref(false);
const router = useRouter();

onMounted(async () => {
  const [conn, stream] = connectionManager.create(
    session.value!.host,
    session.value!.session
  );
  try {
    await conn.auth.checkLoggedIn({});
    sessionValidated.value = true;
    stream.request.send({
      request: {
        oneofKind: "subscribeToHomeserverEvents",
        subscribeToHomeserverEvents: {},
      },
    });
  } catch (e) {
    router.push({ name: "serverselect" });
  }
});
</script>

<template>
  <Splash v-if="!sessionValidated" />
  <div class="h-full w-full">
    <GuildList />
  </div>
</template>
