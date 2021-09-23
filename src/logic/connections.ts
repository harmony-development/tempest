import { Connection } from "@harmony-dev/harmony-web-sdk";
import { host } from "./app";
import { closeStreamHandler, eventStreamHandler } from "./eventStreamHandler";
import { pubsub } from "./api/pubsub";
import { ChatStream } from "~/types";

const connections: {
  [host: string]: Connection;
} = {};
const chatStreams: {
  [host: string]: ChatStream | undefined;
} = {};
const pendingFederations: {
  [host: string]: Promise<Connection> | undefined;
} = {};

export const getOrFederate = (targetHost: string) => {
  const normalised = new URL(targetHost).hostname;
  if (connections[normalised]) return connections[normalised];
  if (pendingFederations[normalised]) return pendingFederations[normalised]!;
  if (targetHost === host.value) {
    const conn = new Connection(targetHost);
    connections[normalised] = conn;
    return conn;
  }
  pendingFederations[normalised] = (async () => {
    const federateResp = await connections[host.value].auth.federate({
      serverId: targetHost,
    });
    const conn = new Connection(targetHost);
    const loginResp = await conn.auth.loginFederated({
      authToken: federateResp.response.token,
      serverId: host.value.replace("https://", ""),
    });
    conn.setSession(loginResp.response.session!.sessionToken);
    connections[normalised] = conn;
    delete pendingFederations[normalised];
    return conn;
  })();
  return pendingFederations[normalised]!;
};

export const getStream = async (
  host: string,
  session?: string
): Promise<ChatStream | undefined> => {
  if (chatStreams[host]) return chatStreams[host];
  const conn = await getOrFederate(host);
  if (session) {
    conn.setSession(session);
  }
  const stream = conn.chat.streamEvents();
  chatStreams[host] = stream;
  stream.responses.onMessage((ev) => pubsub(host));
  stream.responses.onComplete(closeStreamHandler(stream));
  return new Promise(() => stream);
};

export const homeserverConn = () => {
  return getOrFederate(host.value);
};
