import type {
	StreamEvent as StreamChatEvent,
	StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import type { StreamEvent } from "@harmony-dev/harmony-web-sdk/dist/gen/profile/v1/stream";
import type { Oneof, OneofHandler } from "../util/oneof";
import { Handler } from "../util/oneof";
import { chatState } from "../store/chat";
import { convertMessageV1 } from "../conversions/messages";
import { parseHMC } from "../parsing";
import type { ChatRoute } from "~/router";
import { router } from "~/router";
import type { API } from "~/services/api";

const notifsGranted = false;

class HrpcHandler<T extends Oneof> extends Handler<T> {
	constructor(handlers: OneofHandler<T>, protected api: API) {
		super(handlers);
	}
}

export function pubsub(host: string, api: API): (ev: StreamEventsResponse) => void {
	const chatEventsHandler = new HrpcHandler<StreamChatEvent["event"]>({
		editedGuild(host, { editedGuild: { guildId, newName, newPicture } }) {
			chatState.updateGuildData(host, guildId, {
				name: newName,
				picture: newPicture,
			});
		},
		guildAddedToList(host, { guildAddedToList: guild }) {
			api.fetchGuild(host, guild.guildId);
			chatState.state.guildList.push({
				guildID: guild.guildId,
				host: guild.homeserver,
			});
		},
		guildRemovedFromList(_, { guildRemovedFromList: guild }) {
			chatState.state.guildList = chatState.state.guildList.filter(
				g => g.guildID !== guild.guildId || g.host !== guild.homeserver,
			);
		},
		createdChannel(host, { createdChannel }) {
			chatState.addChannel(host, createdChannel.guildId, createdChannel.channelId, {
				name: createdChannel.name,
				kind: 0,
			});
		},
		typing(host, { typing }) {
			chatState.addTyper(host, typing.guildId, typing.channelId, typing.userId);
		},
		async sentMessage(host, { sentMessage }) {
			chatState.addMessage(
				host,
				sentMessage.guildId,
				sentMessage.channelId,
				sentMessage.messageId,
				convertMessageV1(sentMessage.message!),
			);
			const guild = chatState.getGuild(host, sentMessage.guildId);
			const channel = chatState.getChannel(host, sentMessage.guildId, sentMessage.channelId);
			const msg = sentMessage.message!;
			const content = msg.content?.content;
			const user = chatState.getUser(host, msg.authorId);
			const photoSource = msg.overrides?.avatar || user?.picture;

			const title = `${user?.username} in #${channel.data?.name || "unknown-channel"} (${guild.data?.name})`;

			let text: string | undefined;
			const photo = photoSource ? parseHMC(photoSource, host) : undefined;
			switch (content?.oneofKind) {
				case "textMessage":
					text = content.textMessage.content?.text;
					break;
				case "photoMessage":
					text = `Uploaded ${content.photoMessage.photos.map(p => p.name).join(", ")}`;
					break;
				case "attachmentMessage":
					text = `Uploaded ${content.attachmentMessage.files.map(p => p.name).join(", ")}`;
					break;
			}
			if (!notifsGranted) await Notification.requestPermission();

			const { params } = router.currentRoute.value as ChatRoute;
			if (params.host === host && params.guild === sentMessage.guildId && params.channel === sentMessage.channelId) return;

			const notif = new Notification(title, {
				body: text || "unknown message",
				icon: photo,
				timestamp: +msg.createdAt,
				tag: `${host}-${sentMessage.guildId}-${sentMessage.channelId}`,
			});

			notif.addEventListener("click", () =>
				router.push({
					name: "chat",
					params: {
						host,
						guild: sentMessage.guildId,
						channel: sentMessage.channelId,
					},
				}),
			);
		},
		deletedMessage(host, { deletedMessage }) {
			chatState.deleteMessage(host, deletedMessage.guildId, deletedMessage.channelId, deletedMessage.messageId);
		},
	}, api);

	const profileEventsHandler = new Handler<StreamEvent["event"]>({
		profileUpdated(host, { profileUpdated }) {
			const user = chatState.getUser(host, profileUpdated.userId);
			Object.assign(user, {
				username: profileUpdated.newUsername ?? user?.username,
				picture: profileUpdated.newAvatar ?? user?.picture,
				status: profileUpdated.newStatus ?? user?.status,
				isBot: profileUpdated.newIsBot ?? user?.isBot,
			});
		},
	});

	const streamEventsHandler = new Handler<StreamEventsResponse["event"]>({
		chat(host, { chat }) {
			chatEventsHandler.handle(host, chat.event);
		},
		profile(host, { profile }) {
			profileEventsHandler.handle(host, profile.event);
		},
	});

	return ({ event }: StreamEventsResponse) => {
		streamEventsHandler.handle(host, event);
	};
}
