import { useRoute, useRouter } from "vue-router";

export const useHashValue = () => {
  const route = useRoute();
  return decodeURIComponent(route.hash.substr(1));
};

export const updateAppRoute = (args: {
  host?: string;
  guildid?: string | null;
  channelid?: string | null;
  messageid?: string | null;
}) => {
  const router = useRouter();
  const route = useRoute();
  console.log(route);
  const { selectedGuildId, selectedChannelId, selectedHost } = useAppRoute();
  router.push({
    params: {
      guildid: args.guildid || selectedGuildId,
      channelid: args.channelid || selectedChannelId,
    },
    hash: `#${args.host || selectedHost}`,
  });
};
