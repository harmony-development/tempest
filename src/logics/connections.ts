import { Connection } from "@harmony-dev/harmony-web-sdk";
import { host } from "./app";
import { closeStreamHandler, eventStreamHandler } from "./eventStreamHandler";
import { ChatStream } from "~/types";

const connections: {
  [host: string]: Connection;
} = {};
const chatStreams: {
  [host: string]: ChatStream;
} = {};
const pendingFederations: {
  [host: string]: Promise<Connection>;
} = {};

export const getOrFederate = (targetHost: string) => {
  const normalised = new URL(targetHost).hostname
  console.warn(new URL(targetHost))

  if (connections[normalised]) return connections[normalised];
  if (pendingFederations[normalised]) return pendingFederations[normalised];
  if (targetHost === host.value) {
    const conn = new Connection(targetHost);
    connections[normalised] = conn;
    return conn;
  }
  pendingFederations[normalised] = (async () => {
    const federateResp = await connections[host.value].auth.federate({
      target: targetHost,
    });
    const conn = new Connection(targetHost);
    const loginResp = await conn.auth.loginFederated({
      authToken: federateResp.response.token,
      domain: host.value.replace("https://", ""),
    });
    conn.setSession(loginResp.response.sessionToken);
    connections[normalised] = conn;
    delete pendingFederations[normalised];
    return conn;
  })();
  return pendingFederations[normalised];
};

export const getStream = async (host: string, session?: string) => {
  if (chatStreams[host]) return chatStreams[host];
  const conn = await getOrFederate(host);
  if (session) {
    conn.setSession(session);
  }
  const stream = conn.chat.streamEvents();
  chatStreams[host] = stream;
  stream.response.onMessage(eventStreamHandler(host, stream));
  stream.response.onComplete(closeStreamHandler(stream));
  return stream;
};

export const homeserverConn = () => {
  return getOrFederate(host.value);
};
