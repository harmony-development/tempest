import { GuildListEntry } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";

export interface IGuildEntry {
  host: string;
  guildID: string;
}

export const fromV1 = (entry: GuildListEntry): IGuildEntry => ({
  host: entry.serverId,
  guildID: entry.guildId,
});
