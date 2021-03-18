import { useRoute } from "vue-router";

export const useHashValue = () => {
  const route = useRoute();
  return decodeURIComponent(route.hash.substr(1));
};

export const useAppRoute = () => {
  const route = useRoute();

  return {
    selectedGuildId: +route.params.guildid,
    selectedChannelId: +route.params.channelid,
    selectedHost: useHashValue(),
  };
};
