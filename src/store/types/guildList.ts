import { GuildListEntry } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";

export interface IGuildEntry {
  guildId: string;
  host: string;
}

export function FromV1(entry: GuildListEntry): IGuildEntry {
  return {
    guildId: entry.guildId,
    host: entry.serverId,
  };
}
