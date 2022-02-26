import type { UploadedFile } from "@harmony-dev/harmony-web-sdk";
import type { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import type { Guild, GuildListEntry } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/guilds";
import type { SendMessageRequest_Content } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { GetChannelMessagesRequest_Direction, SendMessageRequest_Attachment } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import type { HrpcOptions } from "@harmony-dev/transport-hrpc/build/types/src/transport";
import type { MethodInfo, NextUnaryFn, RpcOptions } from "@protobuf-ts/runtime-rpc";
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { EventEmitter } from "eventemitter3";
import { inject } from "vue";
import { ConnectionManager } from "~/logic/api/connections";
import { convertGuildV1 } from "~/logic/conversions/guilds";
import { convertMessageV1 } from "~/logic/conversions/messages";
import { objectMap } from "~/logic/util/objectMap";
import { sleep } from "~/logic/util/sleep";
import { convertChannelV1 } from "../logic/conversions/channels";
import { chatState } from "../logic/store/chat";
export class API extends EventEmitter<{
	invalidSession: undefined;
	ratelimit: { error: RpcError; method: MethodInfo<any, any>; i: object; options: RpcOptions };
}> {
	private readonly manager: ConnectionManager;

	constructor() {
		super();
		const interceptors = [
			{
				interceptUnary: this.errorInterceptor.bind(this),
			},
			{
				interceptUnary: this.backoffInterceptor.bind(this),
			},
		];
		(import.meta as any).env.DEV &&
			interceptors.push({
				interceptUnary: this.debugInterceptor.bind(this),
			});
		this.manager = new ConnectionManager(interceptors);
	}

	getStream(host: string) {
		return this.manager.getStream(host);
	}

	setSession(host: string, session: string) {
		const { conn } = this.manager.get(host);
		conn.setSession(session);
	}

	checkLoggedIn(host: string, session: string) {
		const { conn } = this.manager.get(host);
		conn.setSession(session);
		return conn.auth.checkLoggedIn({});
	}

	async sendMessage(host: string, guildId: string, channelId: string, text: string, files: File[], inReplyTo?: string) {
		const { conn } = this.manager.get(host);
		const send = (content: SendMessageRequest_Content) =>
			conn.chat.sendMessage({
				guildId,
				channelId,
				inReplyTo,
				content,
			});
		let uploaded: UploadedFile[] = [];
		if (files.length > 0) uploaded = await Promise.all(files.map((f) => conn.uploadFile(f)));
		return send({
			text,
			textFormats: [],
			extra: {
				oneofKind: "attachments",
				attachments: {
					attachments: uploaded.map((u) => SendMessageRequest_Attachment.create(u)),
				},
			},
		});
	}

	joinGuild(host: string, inviteId: string) {
		const { conn } = this.manager.get(host);
		return conn.chat.joinGuild({
			inviteId,
		});
	}

	createGuild(host: string, name: string, picture?: string) {
		const { conn } = this.manager.get(host);
		return conn.chat.createGuild({
			name,
			picture,
		});
	}

	createChannel(host: string, guildId: string, channelName: string, kind: ChannelKind) {
		const { conn } = this.manager.get(host);
		return conn.chat.createChannel({
			guildId,
			channelName,
			kind,
		});
	}

	async fetchMessageList(
		host: string,
		guildId: string,
		channelId: string,
		options: {
			messageId?: string;
			direction?: GetChannelMessagesRequest_Direction;
		} = {}
	) {
		const { messageId, direction } = options;
		const { conn } = this.manager.get(host);
		const { messages, reachedTop } = await conn.chat.getChannelMessages({
			guildId,
			channelId,
			direction: direction || GetChannelMessagesRequest_Direction.BEFORE_UNSPECIFIED,
			messageId,
		}).response;

		if (reachedTop) chatState.setReachedTop(host, guildId, channelId, true);

		for (const { message, messageId } of messages) chatState.setMessageData(host, guildId, channelId, messageId, convertMessageV1(message!));

		const messageList = messages.map((m) => m.messageId);
		chatState.setMessageList(host, guildId, channelId, messageList, messageId !== undefined);
	}

	async fetchUser(host: string, userId: string) {
		const { conn } = this.manager.get(host);
		const { profile } = await conn.profile.getProfile({
			userId: [userId],
		}).response;
		const user = profile[userId];
		chatState.setUserData(host, userId, {
			username: user.userName,
			status: user.userStatus,
			picture: user.userAvatar,
			kind: user.accountKind,
		});
	}

	async fetchMemberList(host: string, guildId: string) {
		const { conn } = this.manager.get(host);
		const { members } = await conn.chat.getGuildMembers({
			guildId,
		}).response;
		const profiles = (
			await conn.profile.getProfile({
				userId: members,
			}).response
		).profile;
		for (const userId in profiles) {
			const profile = profiles[userId];
			chatState.setUserData(host, userId, {
				username: profile.userName,
				status: profile.userStatus,
				picture: profile.userAvatar,
				kind: profile.accountKind,
			});
		}
		chatState.setMembers(host, guildId, members);
	}

	async fetchChannelList(host: string, guildId: string) {
		const { conn } = this.manager.get(host);
		const { channels } = await conn.chat.getGuildChannels({
			guildId,
		}).response;
		for (const { channelId, channel } of channels) chatState.setChannelData(host, guildId, channelId, convertChannelV1(channel!));

		const channelList = channels.map((c) => c.channelId);
		chatState.setGuildChannels(host, guildId, channelList);
	}

	async fetchGuild(host: string, guildId: string): Promise<Guild> {
		const { conn } = this.manager.get(host);
		const guild = (
			await conn.chat.getGuild({
				guildIds: [guildId],
			}).response
		).guild[guildId];
		chatState.setGuildData(host, guildId, convertGuildV1(guild!));
		return guild!;
	}

	async fetchAllGuilds(host: string): Promise<[(Guild & { guildId: string; serverId: string })[], GuildListEntry[]]> {
		const { conn } = this.manager.get(host);
		const { guilds } = await conn.chat.getGuildList({}).response;
		const collected = guilds.reduce<{
			[host: string]: string[];
		}>((acc, current) => {
			const serverId = current.serverId;
			if (!acc[serverId]) acc[serverId] = [];
			acc[serverId].push(current.guildId);
			return acc;
		}, {});

		return [
			(
				await Promise.all(
					Object.entries(collected).map(async ([host, guildIds]) =>
						this.manager
							.get(host)
							.conn.chat.getGuild({
								guildIds,
							})
							.response.then(({ guild }) =>
								Object.values(
									objectMap(guild, (guild, guildId) => ({
										...guild,
										guildId: guildId as string,
										serverId: host,
									}))
								)
							)
					)
				)
			).flat(),
			guilds,
		];
	}

	async updateProfile(host: string, username?: string, avatar?: File, bot?: boolean) {
		const { conn } = this.manager.get(host);
		let newUserAvatar: string | undefined;
		if (avatar) {
			const result = await conn.uploadFile(avatar);
			newUserAvatar = result.id;
		}
		await conn.profile.updateProfile({
			newUserAvatar,
			newUserName: username,
			newIsBot: bot,
		});
	}

	async updateGuild(host: string, guildId: string, name?: string, picture?: File) {
		const { conn } = this.manager.get(host);
		let newPicture: string | undefined;
		if (picture) {
			const result = await conn.uploadFile(picture);
			newPicture = result.id;
		}
		await conn.chat.updateGuildInformation({
			guildId,
			newName: name,
			newPicture,
		});
	}

	leaveGuild(host: string, guildId: string) {
		const { conn } = this.manager.get(host);
		return conn.chat.leaveGuild({
			guildId,
		});
	}

	deleteMessage(host: string, guildId: string, channelId: string, messageId: string) {
		const { conn } = this.manager.get(host);
		return conn.chat.deleteMessage({
			guildId,
			channelId,
			messageId,
		});
	}

	async sendTyping(host: string, guildId: string, channelId: string) {
		const { conn } = this.manager.get(host);
		return conn.chat.typing({
			guildId,
			channelId,
		});
	}

	async fetchMetadata(host: string, urls: string[]) {
		const unfetched = urls.filter((url) => chatState.getURLMetadata(host, url) === undefined);
		const { conn } = this.manager.get(host);
		const { metadata } = await conn.mediaProxy.fetchLinkMetadata({
			// TODO: add error handling here
			url: unfetched,
		}).response;

		chatState.setURLMetadata(
			host,
			objectMap(metadata, (metadata) => metadata.data)
		);
	}

	private backoffInterceptor(next: NextUnaryFn, method: MethodInfo<any, any>, i: object, options: RpcOptions) {
		let retries = 0;
		const maxRetries = 3;

		let result = next(method, i, options);
		const handledResponse = (async () => {
			while (retries < maxRetries) {
				try {
					const resp = await result.response;
					return resp;
				} catch (err) {
					if (err instanceof RpcError && err.code === "hrpc.resource-exhausted") {
						console.warn(`Ratelimited by server, retrying after 5s... (Retry ${retries + 1} of ${maxRetries})`);
						this.emit("ratelimit", { error: err, method, i, options });
						await sleep(5000);
						result = next(method, i, options);
					}
					retries++;
				}
			}
		})();
		// cry about it
		// @ts-expect-error its read only but actually...
		result.response = handledResponse;
		return result;
	}

	private errorInterceptor(next: NextUnaryFn, method: MethodInfo<any, any>, i: object, options: RpcOptions) {
		const result = next(method, i, options);
		result.response.catch((err) => {
			if (err instanceof RpcError) {
				switch (err.code) {
					case "h.blank-session":
						this.emit("invalidSession");
						break;
					case "hrpc.resource-exhausted":
						this.emit("ratelimit", { error: err, method, i, options });
						break;
				}
			}
			// eslint-disable-next-line no-console
			console.log(err);
		});
		return result;
	}

	/* eslint-disable no-console */
	private debugInterceptor(next: NextUnaryFn, method: MethodInfo<any, any>, i: object, options: RpcOptions) {
		const hrpcOpts = options as HrpcOptions;
		const call = next(method, i, options);
		const logRequest = () => console.log("Request(%s):", method.I.typeName.split(".").pop(), Object.assign(i));
		const start = window.performance.now();
		call.response
			.then((res) => {
				const duration = window.performance.now() - start;
				console.groupCollapsed(
					`%c[API]%c: ${hrpcOpts.baseUrl} -> ${method.service.typeName} -> ${method.name} %c[took ${~~duration}ms]`,
					"color: #5978ff",
					"color: #fff",
					"color: #614ef2"
				);
				logRequest();
				console.log("Response(%s)", method.O.typeName.split(".").pop(), Object.fromEntries(Object.entries(res)));
				console.groupEnd();
			})
			.catch((err) => {
				console.groupCollapsed(`%c[API FAIL]%c: ${hrpcOpts.baseUrl} -> ${method.service.typeName} -> ${method.name}`, "color: #ff4000", "color: #fff");
				logRequest();
				console.log("%cError: %c", "color: #ff4000", "color: #fff", JSON.parse(JSON.stringify(err)));
			});
		return call;
	}
	/* eslint-enable no-console */
}

export function useAPI() {
	return inject<API>("api")!;
}
