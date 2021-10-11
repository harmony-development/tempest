import {
  Guild,
  GuildListEntry,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";
import { IGuildEntry, IGuildData } from "../store/chat";

export const convertGuildEntryV1 = (
  entry: GuildListEntry,
  defaultHost: string
): IGuildEntry => ({
  host: entry.serverId || defaultHost,
  guildID: entry.guildId,
});

export const convertGuildV1 = (entry: Guild): Partial<IGuildData> => ({
  name: entry.name,
  owner: entry.ownerId,
  picture: entry.picture,
});