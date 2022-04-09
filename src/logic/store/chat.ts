import type { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import type { Content, Overrides, Reaction } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import type { FetchLinkMetadataResponse_Metadata } from "@harmony-dev/harmony-web-sdk/dist/gen/mediaproxy/v1/mediaproxy";
import type { AccountKind, UserStatus } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/types";
import { assignDefined } from "../util/assignDefined";
import { AsyncLock } from "../util/asyncLock";
import { Store } from "./store";

export interface IGuildEntry {
	host: string;
	guildID: string;
}

interface IUserData {
	username: string;
	picture?: string;
	status: UserStatus;
	kind: AccountKind;
}

export interface IMessageData {
	author: string;
	inReplyTo?: string;
	createdAt: string;
	editedAt?: string;
	content?: Content;
	reactions?: Reaction[];
	override?: Overrides;
}

export interface IChannelData {
	name: string;
	kind: ChannelKind;
}

export interface IChannel {
	data?: IChannelData;
	messages: Record<string, IMessageData | undefined>;
	messageList: string[];
	replyTo?: string;
	typers: {
		[id: string]: number;
	};
	reachedTop?: boolean;
}

export interface IGuildData {
	name: string;
	owners: string[];
	picture?: string;
}

export interface IGuild {
	data?: IGuildData;
	channels: Record<string, IChannel>;
	members: Set<string>;
	channelList?: string[];
	lastChannel?: string;
}

export interface IHostData {
	guilds: Record<string, IGuild>;
	users: Record<string, IUserData>;
	linkMetadata: Record<string, FetchLinkMetadataResponse_Metadata["data"]>;
}

export interface IChatState {
	guildList: IGuildEntry[];
	hosts: Record<string, IHostData>;
}

class ChatState extends Store<IChatState> {
	lock: AsyncLock;

	constructor(data: IChatState) {
		super(data);
		this.lock = new AsyncLock();
	}

	ensureHost(host: string) {
		if (!this.state.hosts[host]) {
			this.state.hosts[host] = {
				guilds: {},
				users: {},
				linkMetadata: {},
			};
		}
		return this.state.hosts[host];
	}

	ensureGuild(host: string, guildID: string) {
		const h = this.ensureHost(host);
		if (!h.guilds[guildID]) {
			h.guilds[guildID] = {
				channels: {},
				members: new Set(),
			};
		}
		return h.guilds[guildID];
	}

	ensureChannel(host: string, guildID: string, channelID: string) {
		const g = this.ensureGuild(host, guildID);
		if (!g.channels[channelID]) {
			g.channels[channelID] = {
				messages: {},
				messageList: [],
				typers: {},
			};
		}
		return g.channels[channelID];
	}

	getGuild(host: string, guildId: string) {
		return this.ensureGuild(host, guildId);
	}

	getChannelList(host: string, guildId: string) {
		return this.ensureGuild(host, guildId).channelList;
	}

	getChannel(host: string, guildId: string, channelId: string) {
		const c = this.ensureChannel(host, guildId, channelId);
		return c;
	}

	getMemberList(host: string, guildId: string) {
		const g = this.ensureGuild(host, guildId);
		return g.members;
	}

	getUser(host: string, userId: string) {
		const h = this.ensureHost(host);
		return h.users[userId] as IUserData | undefined;
	}

	getMessageList(host: string, guildID: string, channelID: string) {
		return this.ensureChannel(host, guildID, channelID).messageList;
	}

	getTypers(host: string, guildID: string, channelID: string) {
		return Object.keys(this.ensureChannel(host, guildID, channelID).typers);
	}

	getMessage(host: string, guildID: string, channelID: string, messageID: string) {
		return this.ensureChannel(host, guildID, channelID).messages[messageID];
	}

	setGuildChannels(host: string, guildID: string, channels: string[]) {
		const g = this.ensureGuild(host, guildID);
		g.channelList = channels;
	}

	setGuildData(host: string, guildID: string, data: IGuildData) {
		const g = this.ensureGuild(host, guildID);
		g.data = data;
	}

	updateGuildData(host: string, guildID: string, data: Partial<IGuildData>) {
		const g = this.ensureGuild(host, guildID);
		assignDefined(g.data, data);
	}

	setChannelData(host: string, guildID: string, channelID: string, data: IChannelData) {
		const c = this.ensureChannel(host, guildID, channelID);
		c.data = {
			...c.data,
			...data,
		};
	}

	setReachedTop(host: string, guildId: string, channelId: string, value: boolean) {
		this.ensureChannel(host, guildId, channelId).reachedTop = value;
	}

	setMessageData(host: string, guildID: string, channelID: string, messageID: string, data: IMessageData) {
		const c = this.ensureChannel(host, guildID, channelID);
		c.messages[messageID] = data;
	}

	setMessageList(host: string, guildID: string, channelID: string, messageList: string[], prepend?: boolean) {
		const c = this.ensureChannel(host, guildID, channelID);
		if (prepend) c.messageList.unshift(...messageList);
		else c.messageList = messageList.reverse();
	}

	setMembers(host: string, guildId: string, memberList: string[]) {
		const g = this.ensureGuild(host, guildId);
		g.members = new Set(memberList);
	}

	setUserData(host: string, userID: string, data: IUserData) {
		const h = this.ensureHost(host);
		h.users[userID] = data;
	}

	addChannel(host: string, guildId: string, channelId: string, data: IChannelData) {
		const g = this.ensureGuild(host, guildId);
		g.channelList?.push(channelId);
		this.ensureChannel(host, guildId, channelId).data = data;
	}

	addMessage(host: string, guildID: string, channelID: string, messageID: string, data: IMessageData) {
		const c = this.ensureChannel(host, guildID, channelID);
		this.setMessageData(host, guildID, channelID, messageID, data);
		c.messageList.push(messageID);
	}

	deleteMessage(host: string, guildID: string, channelID: string, messageID: string) {
		const c = this.ensureChannel(host, guildID, channelID);
		delete c.messages[messageID];
		c.messageList = c.messageList.filter((f) => f !== messageID);
	}

	addTyper(host: string, guildID: string, channelID: string, userID: string, timeout = 3000) {
		const c = this.ensureChannel(host, guildID, channelID);
		c.typers[userID] = Date.now();
		setTimeout(() => {
			const time = c.typers[userID];
			if (time && time + timeout < Date.now()) delete c.typers[userID];
		}, timeout * 2);
	}

	setReplyTo(host: string, guildID: string, channelID: string, messageID: string) {
		const c = this.ensureChannel(host, guildID, channelID);
		c.replyTo = messageID;
	}

	clearReply(host: string, guildID: string, channelID: string) {
		const c = this.ensureChannel(host, guildID, channelID);
		c.replyTo = undefined;
	}

	setURLMetadata(host: string, metadata: Record<string, FetchLinkMetadataResponse_Metadata["data"]>) {
		const h = this.ensureHost(host);
		h.linkMetadata = {
			...h.linkMetadata,
			...metadata,
		};
	}

	getURLMetadata(host: string, url: string) {
		return this.ensureHost(host).linkMetadata[url];
	}
}

export const chatState = new ChatState({
	guildList: [],
	hosts: {},
});

// @ts-expect-error
window.chatState = chatState;
