import { computed } from "@vue/runtime-core";
import { useRoute } from "vue-router";

export const useAppRoute = () => {
  const route = useRoute();
  return computed(
    () =>
      route.params as {
        host: string;
        guildid: string;
        channelid: string;
        messageid: string;
      }
  );
};
