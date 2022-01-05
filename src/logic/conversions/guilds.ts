import type { Guild, GuildListEntry } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";
import type { IGuildData, IGuildEntry } from "../store/chat";

export const convertGuildEntryV1 = (entry: GuildListEntry): IGuildEntry => ({
	host: entry.serverId,
	guildID: entry.guildId,
});

export const convertGuildV1 = (entry: Guild): IGuildData => ({
	name: entry.name,
	owners: entry.ownerIds,
	picture: entry.picture,
});
