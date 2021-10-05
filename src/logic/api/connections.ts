import { Connection } from "@harmony-dev/harmony-web-sdk/dist/src/connection";
import {
  StreamEventsRequest,
  StreamEventsResponse,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { DuplexStreamingCall } from "@protobuf-ts/runtime-rpc";

type ChatStream = DuplexStreamingCall<
  StreamEventsRequest,
  StreamEventsResponse
>;

class ConnectionManager {
  connections: {
    [host: string]: Connection;
  };
  streams: {
    [host: string]: ChatStream;
  };

  constructor() {
    this.connections = {};
    this.streams = {};
  }

  create(host: string, session: string): [Connection, ChatStream] {
    const conn = new Connection(host);
    conn.setSession(session);
    const stream = conn.chat.streamEvents();
    this.connections[host] = conn;
    this.streams[host] = stream;
    return [conn, stream];
  }

  get(host: string) {
    if (this.connections[host]) return this.connections[host];
    const conn = new Connection(host);
    this.connections[host] = conn;
    return conn;
  }
}

export const connectionManager = new ConnectionManager();
