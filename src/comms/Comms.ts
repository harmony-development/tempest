import { Connection } from "@harmony-dev/harmony-web-sdk";
import { GuildEvent } from "@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb";
import { store } from "../redux/redux";
import { addMessage } from "../redux/reducers/AppReducer";
import { grpc } from "@improbable-eng/grpc-web";

export class Comms {
  static homeserver: string;
  static connections: {
    [host: string]: Connection;
  } = {};

  static getHomeserverConn() {
    return this.connections[this.homeserver];
  }

  static async getOrFederate(host: string) {
    if (!this.connections[host]) {
      const resp = await this.getHomeserverConn().federate(host);
      const newConn = new Connection(host);
      await newConn.loginFederated(resp.message?.getToken() || "", host);
      this.connections[host] = newConn;
      Comms.bindEvents(newConn);
    }
    return this.connections[host];
  }

  static onMessage(host: string, event: GuildEvent.MessageSent) {
    const { message } = event.toObject();
    if (message?.location && message.createdAt) {
      store.dispatch(
        addMessage({
          host,
          channelID: message?.location?.channelId,
          messageID: message?.location?.messageId,
          message: {
            authorID: message?.authorId,
            createdAt: message?.createdAt?.seconds,
            content: message?.content,
          },
        })
      );
    }
  }

  static onDisconnect(
    code: grpc.Code,
    message: string,
    trailers: grpc.Metadata
  ) {
    console.log(message);
  }

  static bindEvents(c: Connection) {
    c.events.on(GuildEvent.EventCase.SENT_MESSAGE, this.onMessage);
    c.events.on("disconnect", this.onDisconnect);
  }
}
