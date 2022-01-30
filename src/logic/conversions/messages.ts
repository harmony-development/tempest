import type { Message } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import type { IMessageData } from "../store/chat";

export const convertMessageV1 = (msg: Message): IMessageData => ({
	author: msg.authorId,
	createdAt: msg.createdAt,
	editedAt: msg.editedAt,
	content: msg.content,
	reactions: msg.reactions,
	override: msg.overrides,
	inReplyTo: msg.inReplyTo,
});

export const getMessageText = ({ content: contentOuter }: IMessageData): string | undefined => {
	const content = contentOuter?.content;
	let formatted: string | undefined;
	switch (content?.oneofKind) {
		case "textMessage": {
			formatted = content.textMessage.content?.text;
			break;
		}
		case "attachmentMessage": {
			formatted = "[Attachment]";
			break;
		}
		case "photoMessage": {
			formatted = "[Photo]";
			break;
		}
	}
	return formatted;
};
