import type { StreamEventsRequest, StreamEventsResponse } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/stream";
import { Connection } from "@harmony-dev/harmony-web-sdk/dist/src/connection";
import type { DuplexStreamingCall, RpcInterceptor } from "@protobuf-ts/runtime-rpc";
import { session } from "../store/session";

type ChatStream = DuplexStreamingCall<StreamEventsRequest, StreamEventsResponse>;

interface IConnection {
	conn: Connection
	stream?: ChatStream
}

export class ConnectionManager {
	interceptors?: RpcInterceptor[];
	connections: {
		[host: string]: IConnection
	};

	constructor(interceptors?: RpcInterceptor[]) {
		this.connections = {};
		this.interceptors = interceptors;
	}

	create(host: string, session: string): [Connection, ChatStream] {
		const conn = new Connection(host);
		conn.setSession(session);
		const stream = conn.chat.streamEvents();

		this.connections[host] = { conn, stream };
		return [conn, stream];
	}

	get(host: string) {
		host = host || session.value!.host;
		if (!this.connections[host]) {
			const conn = new Connection(host, {
				interceptors: this.interceptors,
			});
			this.connections[host] = { conn };
		}
		return this.connections[host];
	}

	getStream(host: string) {
		host = host || session.value!.host;
		if (!this.connections[host]?.stream) {
			const { conn } = this.get(host);
			this.connections[host].stream = conn.chat.streamEvents();
		}
		return this.connections[host].stream!;
	}
}
