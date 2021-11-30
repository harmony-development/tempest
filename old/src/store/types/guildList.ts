import { GuildListEntry } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";

export interface IGuildEntry {
  guildId: string;
  host: string;
}

/**
 * Converts a V1 protobuf guild list entry to a GuildEntry
 * @param entry the guild list entry protobuf object
 * @param defaultHost the default host for the guild. Host fields can be empty
 * @returns an IGuildEntry representation of the guild entry
 */
export function FromV1(
  entry: GuildListEntry,
  defaultHost: string
): IGuildEntry {
  return {
    guildId: entry.guildId,
    host: new URL(entry.serverId || defaultHost).origin,
  };
}
