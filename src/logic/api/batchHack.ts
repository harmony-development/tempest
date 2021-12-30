import type { Connection } from "@harmony-dev/harmony-web-sdk";
import { GetGuildRequest, GetGuildResponse } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";
import { GetProfileRequest, GetProfileResponse } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";

export async function batchGetUsers(conn: Connection, users: string[]) {
	const data = await conn.batchSame(
		"/protocol.profile.v1.ProfileService/GetProfile",
		users.map(userId => ({
			userId,
		})),
		GetProfileRequest,
		GetProfileResponse,
	);
	return data.map(r => r.profile);
}

export async function batchGetGuild(conn: Connection, guildIds: string[]) {
	const data = await conn.batchSame(
		"/protocol.chat.v1.ChatService/GetGuild",
		guildIds.map(guildId => ({
			guildId,
		})),
		GetGuildRequest,
		GetGuildResponse,
	);
	return data.map(r => r.guild);
}
