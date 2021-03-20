import { computed } from "vue";
import { useRoute } from "vue-router";

export const useHashValue = () => {
  const route = useRoute();
  return computed(() => decodeURIComponent(route.hash.substr(1)));
};

export const useAppRoute = () => {
  const route = useRoute();
  return computed(() => ({
    guildid: route.params.guildid,
    channelid: route.params.channelid,
    host: decodeURIComponent(route.hash.substr(1)),
  }));
};
